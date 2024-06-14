import type { Dispatch, SetStateAction } from "react";
import type Quill from "quill";
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
  | { type: "jawaban"; deltas: Delta[] };

type ModifiedEditor =
  | { type: "soal"; delta: Delta }
  | { type: "pembahasan"; delta: Delta }
  | { type: "jawaban"; taggedDeltas: TaggedDelta[] };

function createSoal(editors: Editor[]) {
  const combinedTaggedImages: TaggedImage[] = [];
  const modifiedEditors: ModifiedEditor[] = [];

  for (let i = 0; i < editors.length; i++) {
    const editor = editors[i];
    if (editor.type !== "jawaban") {
      const { delta, taggedImages } = replaceBase64ImageWithTag(
        editor.type,
        editor.delta
      );

      combinedTaggedImages.push(...taggedImages);
      modifiedEditors.push({ type: editor.type, delta });
    } else {
      // The delta of each jawaban is tagged with the same tag as image's.
      // The tag is annotated by jawabanTag variable.
      // This is to ensure each image has its corresponding delta.
      const taggedDeltas: TaggedDelta[] = [];
      for (let j = 0; j < editor.deltas.length; j++) {
        const jawabanTag = `${editor.type}${j + 1}`;
        const { delta, taggedImages } = replaceBase64ImageWithTag(
          jawabanTag,
          editor.deltas[j]
        );

        combinedTaggedImages.push(...taggedImages);
        taggedDeltas.push({ tag: jawabanTag, delta });
      }

      modifiedEditors.push({
        type: editor.type,
        taggedDeltas,
      });
    }
  }

  const formData = new FormData();
  const taggedBlobPromises: Promise<TaggedBlob>[] = new Array(
    combinedTaggedImages.length
  );

  for (let i = 0; i < combinedTaggedImages.length; i++) {
    const taggedImage = combinedTaggedImages[i];
    taggedBlobPromises[i] = base64ToBlobWithTag(
      taggedImage.tag,
      taggedImage.encodedImage
    );
  }

  Promise.all(taggedBlobPromises).then((taggedBlobs) => {
    for (let i = 0; i < taggedBlobs.length; i++) {
      formData.append(
        taggedBlobs[i].tag,
        taggedBlobs[i].blob,
        taggedBlobs[i].tag + ".png"
      );
    }
  });

  formData.append("editors", JSON.stringify(modifiedEditors));
}

function generateJawabanEditorProps(
  quillInstances: Quill[],
  setQuillInstances: Dispatch<SetStateAction<Quill>>[]
) {
  const jawaban = new Array(5);
  for (let i = 0; i < jawaban.length; i++) {
    jawaban[i] = {
      quillInstance: quillInstances[i],
      setQuillInstance: setQuillInstances[i],
    };
  }
  return jawaban;
}

function beforeUnloadHandler(event: BeforeUnloadEvent) {
  event.preventDefault();
  // Included for legacy support
  event.returnValue = true;
}

export { createSoal, generateJawabanEditorProps, beforeUnloadHandler };
export type { Editor };
