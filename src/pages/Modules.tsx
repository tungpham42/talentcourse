import { useState } from "react";
import { Card, Button, Container } from "react-bootstrap";
import { modules, Lesson } from "../data/modules";
import LessonModal from "../components/LessonModal";

export default function ModulesPage() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setModalOpen(true);
  };

  return (
    <Container className="mt-5">
      <h1>Strategic Talent Acquisition Guide</h1>
      {modules.map((mod) => (
        <Card className="mb-3" key={mod.id}>
          <Card.Body>
            <Card.Title>{mod.title}</Card.Title>
            <Card.Text>{mod.description}</Card.Text>
            {mod.lessons.map((lesson) => (
              <Button
                variant="outline-primary"
                className="me-2 mt-2"
                key={lesson.id}
                onClick={() => openLesson(lesson)}
              >
                {lesson.title}
              </Button>
            ))}
          </Card.Body>
        </Card>
      ))}

      <LessonModal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        lesson={selectedLesson}
      />
    </Container>
  );
}
