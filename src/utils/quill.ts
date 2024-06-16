import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { type Delta } from "quill/core";

function deltaToHTMLString(delta: Delta): string {
  const deltaConverter = new QuillDeltaToHtmlConverter(delta.ops);
  deltaConverter.afterRender((_, HTMLString) => {
    const HTMLDoc = new DOMParser().parseFromString(HTMLString, "text/html");
    const bodyEl = HTMLDoc.getElementsByTagName("body")[0];
    const latexContainers = bodyEl.querySelectorAll(".ql-formula");

    for (let i = 0; i < latexContainers.length; i++) {
      const latex = latexContainers[i].innerHTML;
      const katex = window.katex.renderToString(latex);
      latexContainers[i].insertAdjacentHTML("beforebegin", katex);
      latexContainers[i].remove();
    }

    return bodyEl.innerHTML;
  });

  const HTMLString = deltaConverter.convert();
  return HTMLString;
}

interface TaggedImage {
  tag: string;
  encodedImage: string;
}

interface ExtractedDelta {
  delta: Delta;
  taggedImages: TaggedImage[];
}

function replaceBase64ImageWithTag(
  imageTag: string,
  delta: Delta
): ExtractedDelta {
  const extractedDelta: ExtractedDelta = { delta, taggedImages: [] };
  let imageNumber = 1;

  // Get encoded image of delta and replace it with imageTag.
  // The obtained encoded image is tagged with imageTag.
  for (let i = 0; i < delta.ops.length; i++) {
    const insert = delta.ops[i].insert;
    const hasImageKey = typeof insert === "object" && "image" in insert;

    if (hasImageKey) {
      const taggedImage: TaggedImage = {
        tag: `${imageTag}-${imageNumber}`,
        encodedImage: insert.image as string,
      };

      extractedDelta.taggedImages.push(taggedImage);
      insert.image = taggedImage.tag;
      imageNumber++;
    }
  }

  return extractedDelta;
}

interface TaggedBlob {
  tag: string;
  blob: Blob;
}

// Create promise of blob along with its tag (blobTag).
// blobTag is used to identify each blob and it's useful when used with multipart/form-data.
function base64ToBlobWithTag(
  blobTag: string,
  encodedImage: string
): () => Promise<TaggedBlob> {
  return () =>
    new Promise<TaggedBlob>((resolve) => {
      const base64Image = encodedImage.split("base64,")[1];
      let binaryString = "";

      try {
        binaryString = window.atob(base64Image);
      } catch (err) {
        // Log the error because it cause file corruption
      }

      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: "image/png" });
      resolve({ tag: blobTag, blob });
    });
}

export { deltaToHTMLString, replaceBase64ImageWithTag, base64ToBlobWithTag };
export type { TaggedImage, TaggedBlob };
