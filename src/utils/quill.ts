import { v4 as uuidv4 } from "uuid";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

interface DeltaOps {
  insert?: string | Record<string, unknown> | undefined;
  delete?: number | undefined;
  retain?: number | Record<string, unknown> | undefined;
  attributes?: Map<string, unknown> | undefined;
}

function deltaToHTMLString(deltaOps: DeltaOps): string {
  const deltaConverter = new QuillDeltaToHtmlConverter(deltaOps as []);
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

function replaceBase64ImageWithTag(
  editorType: string,
  deltaOps: DeltaOps[]
): TaggedImage[] {
  const taggedImages: TaggedImage[] = [];

  // Get encoded image of delta and replace it with uuid.
  // The obtained encoded image is tagged with uuid.
  for (let i = 0; i < deltaOps.length; i++) {
    const insert = deltaOps[i].insert;
    const hasImageKey = typeof insert === "object" && "image" in insert;

    if (hasImageKey) {
      const taggedImage: TaggedImage = {
        tag: `${uuidv4()}_${editorType}`,
        encodedImage: insert.image as string,
      };

      taggedImages.push(taggedImage);
      insert.image = taggedImage.tag;
    }
  }

  return taggedImages;
}

interface TaggedBlob {
  imageTag: string;
  blob: Blob;
}

// Create promise of blob along with its tag (imageTag).
// The tag is obtained from the image's tag.
// imageTag is used to identify each blob and it's useful when used with multipart/form-data.
function base64ToBlobWithTag(
  imageTag: string,
  encodedImage: string
): Promise<TaggedBlob> {
  return new Promise<TaggedBlob>((resolve) => {
    const base64Image = encodedImage.split("base64,")[1];

    let binaryString = "";
    binaryString = window.atob(base64Image);

    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: "image/png" });
    resolve({ imageTag, blob });
  });
}

export { deltaToHTMLString, replaceBase64ImageWithTag, base64ToBlobWithTag };
export type { TaggedImage, DeltaOps };
