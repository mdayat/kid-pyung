import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import type Quill from "quill";
import type { Delta } from "quill/core";
import type { Dispatch, FormEvent, SetStateAction } from "react";

import { QuestionEditor } from "../components/QuestionEditor";
import { ExplanationEditor } from "../components/ExplanationEditor";
import { MultipleChoiceEditor } from "../components/MultipleChoiceEditor";
import { beforeUnloadHandler, createSoal } from "../utils/soal";
import type { Editor, TaggedDelta } from "../utils/soal";

const MATERIAL_ID = "f64fb490-778d-4719-8d01-18f49a3b55a4";

export default function Soal(): JSX.Element {
  const [questionQuill, setQuestionQuill] = useState<Quill>();
  const [explanationQuill, setExplanationQuill] = useState<Quill>();

  const [firstAnswerChoiceQuill, setFirstAnswerChoiceQuill] = useState<Quill>();
  const [secondAnswerChoiceQuill, setSecondAnswerChoiceQuill] =
    useState<Quill>();
  const [thirdAnswerChoiceQuill, setThirdAnswerChoiceQuill] = useState<Quill>();
  const [fourthAnswerChoiceQuill, setFourthAnswerChoiceQuill] =
    useState<Quill>();
  const [fifthAnswerChoiceQuill, setFifthAnswerChoiceQuill] = useState<Quill>();

  function submitCreateSoalHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Deep copy the delta so it doesn't mutate its source (quill instance).
    const multipleChoiceDelta = [
      JSON.parse(JSON.stringify(firstAnswerChoiceQuill?.getContents())),
      JSON.parse(JSON.stringify(secondAnswerChoiceQuill?.getContents())),
      JSON.parse(JSON.stringify(thirdAnswerChoiceQuill?.getContents())),
      JSON.parse(JSON.stringify(fourthAnswerChoiceQuill?.getContents())),
      JSON.parse(JSON.stringify(fifthAnswerChoiceQuill?.getContents())),
    ];

    // The delta of each jawaban is tagged by "answerChoiceTag" variable.
    const taggedDeltas: TaggedDelta[] = new Array(multipleChoiceDelta.length);
    for (let i = 0; i < multipleChoiceDelta.length; i++) {
      const answerChoiceTag = `answer-choice-${i + 1}`;
      taggedDeltas[i] = { tag: answerChoiceTag, delta: multipleChoiceDelta[i] };
    }

    // Deep copy the delta so it doesn't mutate its source (quill instance).
    const editors: Editor[] = [
      {
        type: "question",
        delta: JSON.parse(
          JSON.stringify(questionQuill?.getContents())
        ) as Delta,
      },
      {
        type: "explanation",
        delta: JSON.parse(
          JSON.stringify(explanationQuill?.getContents())
        ) as Delta,
      },
      {
        type: "multipleChoice",
        taggedDeltas,
      },
    ];

    const formData = new FormData(event.currentTarget);
    const learningMaterial = formData.get("learning-material") as string;
    const correctAnswerTag = formData.get("correct-answer") as string;
    const taxonomyBloom = formData.get("taxonomy-bloom") as string;

    createSoal(
      taxonomyBloom,
      MATERIAL_ID,
      learningMaterial,
      correctAnswerTag as string,
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
          <QuestionEditor
            materialID={MATERIAL_ID}
            quillInstance={questionQuill as Quill}
            setQuillInstance={
              setQuestionQuill as Dispatch<SetStateAction<Quill>>
            }
          />
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="1">
        <Accordion.Header>Pembahasan</Accordion.Header>
        <Accordion.Body className="pb-10">
          <ExplanationEditor
            quillInstance={explanationQuill as Quill}
            setQuillInstance={
              setExplanationQuill as Dispatch<SetStateAction<Quill>>
            }
          />
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="2">
        <Accordion.Header>Jawaban</Accordion.Header>
        <Accordion.Body>
          <MultipleChoiceEditor
            answerChoices={[
              {
                quillInstance: firstAnswerChoiceQuill as Quill,
                setQuillInstance: setFirstAnswerChoiceQuill as Dispatch<
                  SetStateAction<Quill>
                >,
              },
              {
                quillInstance: secondAnswerChoiceQuill as Quill,
                setQuillInstance: setSecondAnswerChoiceQuill as Dispatch<
                  SetStateAction<Quill>
                >,
              },
              {
                quillInstance: thirdAnswerChoiceQuill as Quill,
                setQuillInstance: setThirdAnswerChoiceQuill as Dispatch<
                  SetStateAction<Quill>
                >,
              },
              {
                quillInstance: fourthAnswerChoiceQuill as Quill,
                setQuillInstance: setFourthAnswerChoiceQuill as Dispatch<
                  SetStateAction<Quill>
                >,
              },
              {
                quillInstance: fifthAnswerChoiceQuill as Quill,
                setQuillInstance: setFifthAnswerChoiceQuill as Dispatch<
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
