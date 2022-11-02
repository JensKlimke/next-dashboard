import React, {useEffect, useState} from "react";
import {Alert, Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

enum Mode {
  start,
  question,
  finished
}

export type QuestionType = {
    question: string
    answers: {
      text: string
      description: string
    }[]
    correctAnswer: number
}


export default function Quiz({questions} : { questions: QuestionType[] }) {

  const [mode, setMode] = useState(Mode.start);
  const [question, setQuestion] = useState(0);
  const [checked, setChecked] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  const last = (questions.length - 1 <= question);
  const wrong = (questions[question].correctAnswer !== answer && checked);
  const finished = (mode === Mode.finished);
  const starting = (mode === Mode.start);

  const next = () => {
    setAnswer(null);
    setChecked(false);
    setQuestion(question + 1);
  }

  const retry = () => {
    setAnswer(null);
    setChecked(false);
  }

  const restart = () => {
    setMode(Mode.start);
  }

  const start = () => {
    setMode(Mode.question);
    setQuestion(0);
    setAnswer(null);
    setChecked(false);
  }

  const finish = () => {
    setMode(Mode.finished);
    setQuestion(0);
    setAnswer(null);
    setChecked(false);
  }

  useEffect(() => {
    if(answer !== null && checked)
      setDescription(questions[question].answers[answer].description);
    else
      setDescription(null);
  }, [question, questions, answer, checked])

  // generate title
  let title = 'Question ' + (question + 1);
  if(starting)
    title = 'Start quiz';
  else if (finished)
    title = 'Quiz finished'

  // return card
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xl={6} lg={10} sm={12}>
          <Card>
            <Card.Header>{title}</Card.Header>
            <Card.Body>
              {
                (starting) && (
                  <>
                    <span style={{fontSize: "1.5em"}}>
                      This quiz checks your knowledge about sustainability. To start, hit the button below.
                    </span>
                  </>
                )
              }
              {
                (finished) && (
                  <>
                    <span style={{fontSize: "1.5em"}}>
                      <FontAwesomeIcon color="green" icon="check" /> &nbsp;
                      Congratulation, you made it!
                    </span>
                  </>
                )
              }
              {
                (!finished && !starting) && (
                  <>
                    <h4>{questions[question].question}</h4>
                    <hr />
                    <Form>
                      {
                        questions[question].answers.map((e, i) => (
                          <Form.Check
                            onChange={() => setAnswer(i)}
                            checked={answer === i}
                            key={i}
                            id={'check-' + i}
                            disabled={checked}
                            type='radio'
                            name='question'
                            label={e.text}
                          />
                        ))
                      }
                    </Form>
                    {description && (
                      <>
                        <br />
                        <Alert variant={wrong ? "warning" : "success"}>
                          { wrong && <FontAwesomeIcon color="red" icon="xmark" />}
                          {!wrong && <FontAwesomeIcon color="green" icon="check" />}
                          &nbsp;<span>{description}</span>
                        </Alert>
                      </>
                    )}
                  </>
                )
              }
            </Card.Body>
            <Card.Footer>
              { (starting) && <><Button variant="secondary" onClick={() => start()}>Start quiz</Button>&nbsp;</>}
              { (!finished && !checked && !starting) && <><Button variant="secondary" disabled={answer === null} onClick={() => setChecked(true)}>Check in</Button>&nbsp;</>}
              { (!finished && !starting && checked && !last && !wrong) && <><Button variant="success" onClick={next}>Next</Button>&nbsp;</>}
              { (!finished && !starting && checked && wrong) && <><Button variant="warning" onClick={() => retry()}>Try again</Button>&nbsp;</>}
              { (!finished && !starting && checked && last && !wrong) && <><Button variant="success" onClick={() => finish()}>Finish</Button>&nbsp;</>}
              { finished && <><Button variant="light" onClick={() => restart()}>Restart</Button></>}
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
