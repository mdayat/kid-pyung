import Form from "react-bootstrap/Form";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import type Quill from "quill";
import type { Dispatch, SetStateAction } from "react";

import { RichTextEditor } from "./RichTextEditor";
import { type DeltaOps, deltaToHTMLString } from "../utils/quill";

interface MultipleChoiceEditorProps {
  answerChoices: {
    quillInstance: Quill;
    setQuillInstance: Dispatch<SetStateAction<Quill>>;
  }[];
}

export function MultipleChoiceEditor({
  answerChoices,
}: MultipleChoiceEditorProps): JSX.Element {
  function showEditorPreview(eventKey: string | null) {
    if (eventKey === "preview") {
      for (let i = 0; i < answerChoices.length; i++) {
        const divEl = document.getElementById(
          `answer-choice-${i + 1}-preview`
        ) as HTMLDivElement;

        const htmlString = deltaToHTMLString(
          answerChoices[i].quillInstance.getContents().ops as DeltaOps
        );

        divEl.insertAdjacentHTML("beforeend", htmlString);
      }
    } else {
      for (let i = 0; i < answerChoices.length; i++) {
        const divEl = document.getElementById(
          `answer-choice-${i + 1}-preview`
        ) as HTMLDivElement;
        divEl.innerHTML = "";
      }
    }
  }

  return (
    <Tabs
      onSelect={showEditorPreview}
      justify
      id="multiple-choice-form"
      defaultActiveKey="editor"
      variant="underline"
      className="mb-4"
    >
      <Tab eventKey="editor" title="Editor">
        {answerChoices.map(({ setQuillInstance }, index) => (
          <Form.Group
            key={`answer-choice-${index + 1}-rich-text-editor`}
            className="mb-6 last:mb-0"
          >
            <div className="flex justify-between items-center mb-3">
              <Form.Label as="p" className="mb-0">
                Teks Editor Jawaban {index + 1}
              </Form.Label>

              <Form.Check
                required
                id={`answer-choice-${index + 1}`}
                value={`answer-choice-${index + 1}`}
                type="radio"
                name="correct-answer"
                label="Pilih Sebagai Jawaban Benar"
                className="[&_*]:cursor-pointer mb-0"
              />
            </div>

            <RichTextEditor
              setQuillInstance={setQuillInstance}
              editorID={`answer-choice-${index + 1}-editor`}
              toolbarID={`answer-choice-${index + 1}-toolbar`}
            />
          </Form.Group>
        ))}
      </Tab>

      <Tab eventKey="preview" title="Preview">
        {answerChoices.map((_, index) => (
          <div
            key={`answer-choice-${index + 1}-preview`}
            id={`answer-choice-${index + 1}-preview`}
            className="border !p-4 [&_img]:w-96 !mb-4 last:!mb-0"
          ></div>
        ))}
      </Tab>
    </Tabs>
  );
}
