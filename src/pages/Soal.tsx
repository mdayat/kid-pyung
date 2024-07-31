import { useEffect, useState } from "react";
import { z as zod } from "zod";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import type Quill from "quill";
import type { Dispatch, FormEvent, SetStateAction } from "react";

import { QuestionEditor } from "../components/QuestionEditor";
import { ExplanationEditor } from "../components/ExplanationEditor";
import { MultipleChoiceEditor } from "../components/MultipleChoiceEditor";
import withAuth from "../hoc/withAuth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { beforeUnloadHandler, createSoal } from "../utils/soal";
import { editorSchema, type Editor, type TaggedDelta } from "../types/editor";

const MATERIAL_ID = "f64fb490-778d-4719-8d01-18f49a3b55a4";

function Soal(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [questionQuill, setQuestionQuill] = useState<Quill>();
  const [explanationQuill, setExplanationQuill] = useState<Quill>();

  const [firstAnswerChoiceQuill, setFirstAnswerChoiceQuill] = useState<Quill>();
  const [secondAnswerChoiceQuill, setSecondAnswerChoiceQuill] =
    useState<Quill>();
  const [thirdAnswerChoiceQuill, setThirdAnswerChoiceQuill] = useState<Quill>();
  const [fourthAnswerChoiceQuill, setFourthAnswerChoiceQuill] =
    useState<Quill>();
  const [fifthAnswerChoiceQuill, setFifthAnswerChoiceQuill] = useState<Quill>();
  const [user] = useAuthState(auth);

  async function submitCreateSoalHandler(event: FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    event.preventDefault();
    // Deep copy the delta so it doesn't mutate its source (quill instance).
    const multipleChoiceDelta = [
      JSON.parse(JSON.stringify(firstAnswerChoiceQuill?.getContents().ops)),
      JSON.parse(JSON.stringify(secondAnswerChoiceQuill?.getContents().ops)),
      JSON.parse(JSON.stringify(thirdAnswerChoiceQuill?.getContents().ops)),
      JSON.parse(JSON.stringify(fourthAnswerChoiceQuill?.getContents().ops)),
      JSON.parse(JSON.stringify(fifthAnswerChoiceQuill?.getContents().ops)),
    ];

    // The delta of each jawaban is tagged by "answerChoiceTag" variable.
    const taggedDeltas: TaggedDelta[] = new Array(multipleChoiceDelta.length);
    for (let i = 0; i < multipleChoiceDelta.length; i++) {
      const answerChoiceTag = `answer-choice-${i + 1}`;
      taggedDeltas[i] = {
        tag: answerChoiceTag,
        deltaOperations: multipleChoiceDelta[i],
      };
    }

    // Deep copy the delta so it doesn't mutate its source (quill instance).
    const editors: Editor[] = [
      {
        type: "question",
        deltaOperations: JSON.parse(
          JSON.stringify(questionQuill?.getContents().ops)
        ),
      },
      {
        type: "explanation",
        deltaOperations: JSON.parse(
          JSON.stringify(explanationQuill?.getContents().ops)
        ),
      },
      {
        type: "multipleChoice",
        taggedDeltas,
      },
    ];

    const result = zod.array(editorSchema).safeParse(editors);
    if (result.success === false) {
      console.error("Invalid Editor Schema: ", result.error);
      alert("ZOD PARSE ERROR!!!");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const learningMaterialID = formData.get("learning-material") as string;
    const correctAnswerTag = formData.get("correct-answer") as string;
    const taxonomyBloom = formData.get("taxonomy-bloom") as string;

    try {
      if (!user) {
        throw new Error("User is not authenticated");
      }
      await createSoal(
        taxonomyBloom,
        MATERIAL_ID,
        learningMaterialID,
        correctAnswerTag as string,
        editors,
        await user.getIdToken()
      );
      alert("SUKSES MEMBUAT SOAL");

      // questionQuill?.setContents([]);
      // explanationQuill?.setContents([]);
      // firstAnswerChoiceQuill?.setContents([]);
      // secondAnswerChoiceQuill?.setContents([]);
      // thirdAnswerChoiceQuill?.setContents([]);
      // fourthAnswerChoiceQuill?.setContents([]);
      // fifthAnswerChoiceQuill?.setContents([]);
    } catch (error) {
      console.error("Create Soal Error: ", error);
      alert("GAGAL MEMBUAT SOAL");
    } finally {
      setIsLoading(false);
    }
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

      <Button disabled={isLoading} type="submit" className="block mx-auto mt-6">
        {isLoading ? "LOADING..." : "Buat Soal"}
      </Button>
    </Accordion>
  );
}

export default withAuth(Soal);
