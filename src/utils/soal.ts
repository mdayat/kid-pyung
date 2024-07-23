import type { Delta } from "quill/core";
import { replaceBase64ImageWithTag, base64ToBlobWithTag } from "./quill";
import type { TaggedBlob, TaggedImage } from "./quill";

interface TaggedDelta {
  tag: string;
  delta: Delta;
}

type Editor =
  | { type: "soal"; delta: Delta }
  | { type: "pembahasan"; delta: Delta }
  | { type: "jawaban"; taggedDeltas: TaggedDelta[] };

function createSoal(
  materialID: string,
  learningMaterial: string,
  jawabanBenarTag: string,
  editors: Editor[]
) {
  const combinedTaggedImages: TaggedImage[] = [];
  for (let i = 0; i < editors.length; i++) {
    const editor = editors[i];
    if (editor.type !== "jawaban") {
      const taggedImages = replaceBase64ImageWithTag(editor.type, editor.delta);
      combinedTaggedImages.push(...taggedImages);
    } else {
      // The image of each jawaban is tagged by jawaban delta tag.
      // This is to ensure each image has its corresponding delta.
      for (let j = 0; j < editor.taggedDeltas.length; j++) {
        const taggedImages = replaceBase64ImageWithTag(
          editor.taggedDeltas[j].tag,
          editor.taggedDeltas[j].delta
        );
        combinedTaggedImages.push(...taggedImages);
      }
    }
  }

  const formData = new FormData();
  const taggedBlobPromises: Array<() => Promise<TaggedBlob>> = new Array(
    combinedTaggedImages.length
  );

  for (let i = 0; i < combinedTaggedImages.length; i++) {
    const taggedImage = combinedTaggedImages[i];
    taggedBlobPromises[i] = base64ToBlobWithTag(
      taggedImage.tag,
      taggedImage.encodedImage
    );
  }

  Promise.all(
    taggedBlobPromises.map((taggedBlobPromise) => taggedBlobPromise())
  ).then((taggedBlobs) => {
    for (let i = 0; i < taggedBlobs.length; i++) {
      formData.append(
        taggedBlobs[i].imageTag,
        taggedBlobs[i].blob,
        taggedBlobs[i].imageTag + ".png"
      );
    }
  });

  const learningMaterialID = learningMaterial.split("/")[1];
  formData.append(
    "question",
    JSON.stringify({
      learningMaterialID: learningMaterialID,
      jawabanBenarTag,
      editors,
    })
  );

  const learningMaterialType =
    learningMaterial.split("/")[0].split("_").join("-") + "s";

  fetch(
    `http://localhost:3000/api/materials/${materialID}/${learningMaterialType}/${learningMaterialID}/questions`,
    {
      method: "POST",
      body: formData,
    }
  );
}

function beforeUnloadHandler(event: BeforeUnloadEvent) {
  event.preventDefault();
  // Included for legacy support
  event.returnValue = true;
}

export { createSoal, beforeUnloadHandler };
export type { Editor, TaggedDelta };
