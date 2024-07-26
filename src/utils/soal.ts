import { replaceBase64ImageWithTag, base64ToBlobWithTag } from "./quill";
import type { DeltaOps, TaggedImage } from "./quill";

interface TaggedDelta {
  tag: string;
  deltaOps: DeltaOps[];
}

type Editor =
  | { type: "question"; deltaOps: DeltaOps[] }
  | { type: "explanation"; deltaOps: DeltaOps[] }
  | { type: "multipleChoice"; taggedDeltas: TaggedDelta[] };

async function createSoal(
  taxonomyBloom: string,
  materialID: string,
  learningMaterial: string,
  correctAnswerTag: string,
  editors: Editor[]
) {
  const combinedTaggedImages: TaggedImage[] = [];
  for (let i = 0; i < editors.length; i++) {
    const editor = editors[i];
    if (editor.type !== "multipleChoice") {
      const taggedImages = replaceBase64ImageWithTag(
        editor.type,
        editor.deltaOps
      );
      combinedTaggedImages.push(...taggedImages);
      continue;
    }

    for (let j = 0; j < editor.taggedDeltas.length; j++) {
      const taggedImages = replaceBase64ImageWithTag(
        editor.taggedDeltas[j].tag,
        editor.taggedDeltas[j].deltaOps
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

  const learningMaterialID = learningMaterial.split("/")[1];
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
