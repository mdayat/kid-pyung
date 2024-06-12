import { useState } from "react";
import Quill from "quill";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import type { Dispatch, FormEvent, SetStateAction } from "react";

import { RichTextEditor } from "../components/RichTextEditor";
import { SoalEditor } from "../components/SoalEditor";

export default function Soal(): JSX.Element {
  const [soalQuill, setSoalQuill] = useState<Quill>();
  const [pembahasanQuill, setPembahasanQuill] = useState<Quill>();
  function submitCreateSoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <Accordion
      as={Form}
      onSubmit={submitCreateSoal}
      action=""
      defaultActiveKey="0"
    >
      <Accordion.Item eventKey="0">
        <Accordion.Header>Soal</Accordion.Header>
        <Accordion.Body>
          <SoalEditor
            setSoalQuill={setSoalQuill as Dispatch<SetStateAction<Quill>>}
          />
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="1">
        <Accordion.Header>Pembahasan</Accordion.Header>
        <Accordion.Body as={Form.Group}>
          <Form.Label as="p">Teks Editor Pembahasan</Form.Label>
          <RichTextEditor
            setEditorInstance={
              setPembahasanQuill as Dispatch<SetStateAction<Quill>>
            }
            editorID="pembahasan-editor"
            toolbarID="pembahasan-toolbar"
          />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
