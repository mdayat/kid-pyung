import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import type Quill from "quill";
import type { Delta } from "quill/core";
import type { Dispatch, FormEvent, SetStateAction } from "react";

import { SoalEditor } from "../components/SoalEditor";
import { PembahasanEditor } from "../components/PembahasanEditor";
import { JawabanEditor } from "../components/JawabanEditor";
import {
  beforeUnloadHandler,
  createSoal,
  generateJawabanEditorProps,
} from "../utils/soal";
import type { Editor } from "../utils/soal";

export default function Soal(): JSX.Element {
  const [soalQuill, setSoalQuill] = useState<Quill>();
  const [pembahasanQuill, setPembahasanQuill] = useState<Quill>();

  const [jawaban1Quill, setJawaban1Quill] = useState<Quill>();
  const [jawaban2Quill, setJawaban2Quill] = useState<Quill>();
  const [jawaban3Quill, setJawaban3Quill] = useState<Quill>();
  const [jawaban4Quill, setJawaban4Quill] = useState<Quill>();
  const [jawaban5Quill, setJawaban5Quill] = useState<Quill>();

  function submitCreateSoalHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const editors: Editor[] = [
      { type: "soal", delta: soalQuill?.getContents() as Delta },
      { type: "pembahasan", delta: pembahasanQuill?.getContents() as Delta },
      {
        type: "jawaban",
        deltas: [
          jawaban1Quill?.getContents() as Delta,
          jawaban2Quill?.getContents() as Delta,
          jawaban3Quill?.getContents() as Delta,
          jawaban4Quill?.getContents() as Delta,
          jawaban5Quill?.getContents() as Delta,
        ],
      },
    ];

    createSoal(editors);
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
      onSubmit={submitCreateSoalHandler}
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

      <Button type="submit" className="block mx-auto mt-6">
        Buat Soal
      </Button>
    </Accordion>
  );
}
