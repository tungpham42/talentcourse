import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp, faStop, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Lesson } from "../data/modules";
import { speak, stop, getVoices } from "../utils/tts";
import striptags from "striptags";

interface Props {
  show: boolean;
  onHide: () => void;
  lesson: Lesson | null;
}

export default function LessonModal({ show, onHide, lesson }: Props) {
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleSelectAnswer = (index: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(index);
    }
  };

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = getVoices();
      setVoices(allVoices);
      if (allVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(
          allVoices.find((v) => v.lang.startsWith("en")) || allVoices[0]
        );
      }
    };

    if (
      typeof window !== "undefined" &&
      window.speechSynthesis.onvoiceschanged !== undefined
    ) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    loadVoices();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!show) {
      setSelectedAnswer(null);
      stop();
      setRate(1);
      setSelectedVoice(null);
    }
  }, [show]);

  const handlePlay = () => {
    if (!lesson) return;
    const plainText = striptags(lesson.content);
    let textToRead = plainText;

    if (lesson.keyTakeaways?.length) {
      const takeawaysText =
        "Key takeaways: " +
        lesson.keyTakeaways.map((point, i) => `${i + 1}. ${point}`).join(". ");
      textToRead += ". " + takeawaysText;
    }

    speak(textToRead, rate, selectedVoice || undefined);
  };

  const handleStop = () => stop();

  if (!lesson) return null;

  return (
    <Modal
      size="lg"
      show={show}
      onHide={() => {
        stop();
        onHide();
      }}
      centered
    >
      <Modal.Header>
        <Modal.Title>{lesson.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
        {lesson.keyTakeaways && (
          <>
            <h5>Key Takeaways</h5>
            <ul>
              {lesson.keyTakeaways.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </>
        )}
        {lesson.quiz && (
          <>
            <h5 className="mt-4">Quiz</h5>
            <div className="mb-4">
              <strong>{lesson.quiz.question}</strong>
              <Form>
                {lesson.quiz.options.map((opt, idx) => (
                  <Form.Check
                    key={idx}
                    type="radio"
                    name="quiz"
                    id={`quiz-opt-${idx}`}
                    label={opt}
                    checked={selectedAnswer === idx}
                    onChange={() => handleSelectAnswer(idx)}
                    disabled={selectedAnswer !== null}
                  />
                ))}
              </Form>
              {selectedAnswer !== null && (
                <div
                  className={`mt-2 ${
                    selectedAnswer === lesson.quiz.correctAnswerIndex
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {selectedAnswer === lesson.quiz.correctAnswerIndex
                    ? "Correct!"
                    : `Incorrect. Correct answer: ${
                        lesson.quiz.options[lesson.quiz.correctAnswerIndex]
                      }`}
                </div>
              )}
            </div>
          </>
        )}
        <Form.Group className="mb-3">
          <Form.Label>Speed</Form.Label>
          <Form.Range
            min={0.5}
            max={2}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
          />
          <div>Rate: {rate.toFixed(1)}</div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Voice</Form.Label>
          <Form.Select
            value={selectedVoice?.name}
            onChange={(e) =>
              setSelectedVoice(
                voices.find((v) => v.name === e.target.value) || null
              )
            }
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handlePlay}>
          <FontAwesomeIcon icon={faVolumeUp} className="me-2" />
          Listen
        </Button>
        <Button variant="danger" onClick={handleStop}>
          <FontAwesomeIcon icon={faStop} className="me-2" />
          Stop
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            stop();
            onHide();
          }}
        >
          <FontAwesomeIcon icon={faTimes} className="me-2" />
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
