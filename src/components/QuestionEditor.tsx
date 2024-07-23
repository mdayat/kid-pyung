import Form from "react-bootstrap/Form";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type Quill from "quill";

import { RichTextEditor } from "./RichTextEditor";
import { deltaToHTMLString } from "../utils/quill";

interface LearningMaterial {
  id: string;
  name: string;
  description: string;
  learningModuleURL: string;
  type: "prerequisite" | "sub_material";
  sequenceNumber: number;
}

interface QuestionEditorProps {
  materialID: string;
  quillInstance: Quill;
  setQuillInstance: Dispatch<SetStateAction<Quill>>;
}

export function QuestionEditor({
  materialID,
  quillInstance,
  setQuillInstance,
}: QuestionEditorProps): JSX.Element {
  const [learningMaterials, setLearningMaterials] = useState<
    LearningMaterial[]
  >([]);

  function showEditorPreview(eventKey: string | null) {
    const divEl = document.getElementById("question-preview") as HTMLDivElement;
    if (eventKey === "preview") {
      const htmlString = deltaToHTMLString(quillInstance.getContents());
      divEl.insertAdjacentHTML("beforeend", htmlString);
    } else {
      divEl.innerHTML = "";
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await Promise.all([
          fetch(
            `http://localhost:3000/api/materials/${materialID}/prerequisites`
          ),
          fetch(
            `http://localhost:3000/api/materials/${materialID}/sub-materials`
          ),
        ]);

        const results: Array<{
          status: "success" | "failed";
          data: LearningMaterial[];
        }> = await Promise.all([response[0].json(), response[1].json()]);

        setLearningMaterials([...results[0].data].concat(results[1].data));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [materialID]);

  return (
    <Tabs
      onSelect={showEditorPreview}
      justify
      id="question-form"
      defaultActiveKey="editor"
      variant="underline"
      className="mb-4"
    >
      <Tab eventKey="editor" title="Editor">
        <Form.Group className="max-w-sm mb-6">
          <Form.Select
            disabled={learningMaterials.length === 0}
            name="learning-material"
            required
          >
            {learningMaterials.map(({ id, name, type }) => (
              <option key={id} value={`${type}/${id}`}>
                {name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="max-w-sm mb-6">
          <Form.Select name="taxonomy-bloom" required>
            <option value="c1">C1</option>
            <option value="c2">C2</option>
            <option value="c3">C3</option>
            <option value="c4">C4</option>
            <option value="c5">C5</option>
            <option value="c6">C6</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label as="p">Teks Editor Soal</Form.Label>
          <RichTextEditor
            setQuillInstance={setQuillInstance}
            editorID="question-editor"
            toolbarID="question-toolbar"
          />
        </Form.Group>
      </Tab>

      <Tab eventKey="preview" title="Preview">
        <div id="question-preview" className="border !p-4 [&_img]:w-96"></div>
      </Tab>
    </Tabs>
  );
}
