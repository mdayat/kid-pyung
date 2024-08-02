import {
  replaceBase64ImageWithTag,
  base64ToBlobWithTag,
  type TaggedImage,
} from "./quill";
import type { Editor } from "../types/editor";

async function createSoal(
  taxonomyBloom: string,
  materialID: string,
  learningMaterialID: string,
  correctAnswerTag: string,
  editors: Editor[]
  // jwt: string
) {
  const combinedTaggedImages: TaggedImage[] = [];
  for (let i = 0; i < editors.length; i++) {
    const editor = editors[i];
    if (editor.type !== "multipleChoice") {
      const taggedImages = replaceBase64ImageWithTag(
        editor.type,
        editor.deltaOperations
      );
      combinedTaggedImages.push(...taggedImages);
      continue;
    }

    for (let j = 0; j < editor.taggedDeltas.length; j++) {
      const taggedImages = replaceBase64ImageWithTag(
        editor.taggedDeltas[j].tag,
        editor.taggedDeltas[j].deltaOperations
      );
      combinedTaggedImages.push(...taggedImages);
    }
  }

  const formData = new FormData();
  const taggedBlobs = await Promise.all(
    combinedTaggedImages.map((taggedImage) =>
      base64ToBlobWithTag(taggedImage.tag, taggedImage.encodedImage)
    )
  );

  for (let i = 0; i < taggedBlobs.length; i++) {
    formData.append(
      taggedBlobs[i].imageTag,
      taggedBlobs[i].blob,
      taggedBlobs[i].imageTag + ".png"
    );
  }

  formData.append(
    "question",
    JSON.stringify({
      taxonomyBloom,
      correctAnswerTag,
      editors,
    })
  );

  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/materials/${materialID}/learning-materials/${learningMaterialID}/questions`,
    {
      method: "POST",
      body: formData,
      // headers: {
      //   Authorization: `Bearer ${jwt}`,
      // },
    }
  );
  if (res.status !== 201) {
    throw new Error(((await res.json()) as { message: string }).message);
  }
}

// Prevent user from refreshing the page
function beforeUnloadHandler(event: BeforeUnloadEvent) {
  event.preventDefault();
  // Included for legacy support
  event.returnValue = true;
}

export { createSoal, beforeUnloadHandler };
