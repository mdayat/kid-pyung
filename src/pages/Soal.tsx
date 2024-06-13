import { useEffect, useState } from "react";
import Quill from "quill";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import type { Dispatch, FormEvent, SetStateAction } from "react";

import { SoalEditor } from "../components/SoalEditor";
import { PembahasanEditor } from "../components/PembahasanEditor";
import { JawabanEditor } from "../components/JawabanEditor";

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

export default function Soal(): JSX.Element {
  const [soalQuill, setSoalQuill] = useState<Quill>();
  const [pembahasanQuill, setPembahasanQuill] = useState<Quill>();

  const [jawaban1Quill, setJawaban1Quill] = useState<Quill>();
  const [jawaban2Quill, setJawaban2Quill] = useState<Quill>();
  const [jawaban3Quill, setJawaban3Quill] = useState<Quill>();
  const [jawaban4Quill, setJawaban4Quill] = useState<Quill>();
  const [jawaban5Quill, setJawaban5Quill] = useState<Quill>();

  function submitCreateSoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  useEffect(() => {
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  return (
    <Accordion
      as={Form}
      onSubmit={submitCreateSoal}
      action=""
      defaultActiveKey="0"
    >
      <Accordion.Item eventKey="0">
        <Accordion.Header>Soal</Accordion.Header>
        <Accordion.Body className="pb-10">
          <SoalEditor
            quillInstance={soalQuill as Quill}
            setQuillInstance={setSoalQuill as Dispatch<SetStateAction<Quill>>}
          />
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="1">
        <Accordion.Header>Pembahasan</Accordion.Header>
        <Accordion.Body className="pb-10">
          <PembahasanEditor
            quillInstance={pembahasanQuill as Quill}
            setQuillInstance={
              setPembahasanQuill as Dispatch<SetStateAction<Quill>>
            }
          />
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="2">
        <Accordion.Header>Jawaban</Accordion.Header>
        <Accordion.Body>
          <JawabanEditor
            jawaban={generateJawabanEditorProps(
              [
                jawaban1Quill as Quill,
                jawaban2Quill as Quill,
                jawaban3Quill as Quill,
                jawaban4Quill as Quill,
                jawaban5Quill as Quill,
              ],
              [
                setJawaban1Quill as Dispatch<SetStateAction<Quill>>,
                setJawaban2Quill as Dispatch<SetStateAction<Quill>>,
                setJawaban3Quill as Dispatch<SetStateAction<Quill>>,
                setJawaban4Quill as Dispatch<SetStateAction<Quill>>,
                setJawaban5Quill as Dispatch<SetStateAction<Quill>>,
              ]
            )}
          />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
