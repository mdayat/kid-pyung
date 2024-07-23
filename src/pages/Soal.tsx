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
import { beforeUnloadHandler, createSoal } from "../utils/soal";
import type { Editor, TaggedDelta } from "../utils/soal";

const MATERIAL_ID = "f64fb490-778d-4719-8d01-18f49a3b55a4";

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
    // Deep copy the delta so it doesn't mutate its source (quill instance).
    const jawabanDeltas = [
      JSON.parse(JSON.stringify(jawaban1Quill?.getContents())) as Delta,
      JSON.parse(JSON.stringify(jawaban2Quill?.getContents())) as Delta,
      JSON.parse(JSON.stringify(jawaban3Quill?.getContents())) as Delta,
      JSON.parse(JSON.stringify(jawaban4Quill?.getContents())) as Delta,
      JSON.parse(JSON.stringify(jawaban5Quill?.getContents())) as Delta,
    ];

    // The delta of each jawaban is tagged by jawabanTag variable.
    const taggedDeltas: TaggedDelta[] = [];
    for (let i = 0; i < jawabanDeltas.length; i++) {
      const jawabanTag = `jawaban${i + 1}`;
      taggedDeltas.push({ tag: jawabanTag, delta: jawabanDeltas[i] });
    }

    // Deep copy the delta so it doesn't mutate its source (quill instance).
    const editors: Editor[] = [
      {
        type: "soal",
        delta: JSON.parse(JSON.stringify(soalQuill?.getContents())) as Delta,
      },
      {
        type: "pembahasan",
        delta: JSON.parse(
          JSON.stringify(pembahasanQuill?.getContents())
        ) as Delta,
      },
      {
        type: "jawaban",
        taggedDeltas,
      },
    ];

    const formData = new FormData(event.currentTarget);
    const learningMaterial = formData.get("learning-material") as string;
    const jawabanBenarTag = formData.get("jawaban-benar") as string;

    createSoal(
      MATERIAL_ID,
      learningMaterial,
      jawabanBenarTag as string,
      editors
    );
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
            materialID={MATERIAL_ID}
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
            jawaban={[
              {
                quillInstance: jawaban1Quill as Quill,
                setQuillInstance: setJawaban1Quill as Dispatch<
                  SetStateAction<Quill>
                >,
              },
              {
                quillInstance: jawaban2Quill as Quill,
                setQuillInstance: setJawaban2Quill as Dispatch<
                  SetStateAction<Quill>
                >,
              },
              {
                quillInstance: jawaban3Quill as Quill,
                setQuillInstance: setJawaban3Quill as Dispatch<
                  SetStateAction<Quill>
                >,
              },
              {
                quillInstance: jawaban4Quill as Quill,
                setQuillInstance: setJawaban4Quill as Dispatch<
                  SetStateAction<Quill>
                >,
              },
              {
                quillInstance: jawaban5Quill as Quill,
                setQuillInstance: setJawaban5Quill as Dispatch<
                  SetStateAction<Quill>
                >,
              },
            ]}
          />
        </Accordion.Body>
      </Accordion.Item>

      <Button type="submit" className="block mx-auto mt-6">
        Buat Soal
      </Button>
    </Accordion>
  );
}
