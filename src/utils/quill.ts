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

interface ImageData {
  id: string;
  encodedImage: string;
}

type EditorData = [modifiedDelta: Delta, imagesData: ImageData[]];
type IDType =
  | "soal"
  | "pembahasan"
  | "jawaban1"
  | "jawaban2"
  | "jawaban3"
  | "jawaban4"
  | "jawaban5";

function replaceBase64ImageWithID(delta: Delta, IDType: IDType): EditorData {
  const editorData: EditorData = [delta, []];
  let imageNumber = 1;

  for (let i = 0; i < delta.ops.length; i++) {
    const insert = delta.ops[i].insert;
    const hasImageKey = typeof insert === "object" && "image" in insert;

    if (hasImageKey) {
      const imageData: ImageData = {
        id: `${IDType}-${imageNumber}`,
        encodedImage: insert.image as string,
      };

      editorData[1].push(imageData);
      insert.image = `${IDType}-${imageNumber}`;
      imageNumber++;
    }
  }

  return editorData;
}

interface BlobPromiseData {
  imageID: string;
  blob: Blob;
}

function base64ToBlob(
  imageID: string,
  encodedImage: string
): Promise<BlobPromiseData> {
  const promise = new Promise<BlobPromiseData>((resolve) => {
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
    resolve({ imageID, blob });
  });

  return promise;
}

export { deltaToHTMLString, replaceBase64ImageWithID, base64ToBlob };
