//import { FormEvent, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import trashRedImg from '../assets/images/trash-red.svg'
import closeImg from '../assets/images/close.svg' 

import { Button } from '../components/Button/Button'
import { Question } from '../components/Question/Question'
import { RoomCode } from '../components/RoomCode/RoomCode'
import { ModalRemove } from '../components/ModalRemove/ModalRemove'
//import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'
//import { database } from '../services/firebase'

import '../styles/room.scss'
import { database } from '../services/firebase'
import { useState } from 'react'


type RoomParams = {
  id: string
}


export function AdminRoom() {
  //const { user } = useAuth()
  const history = useHistory()
  const params = useParams<RoomParams>()
  const roomId = params.id
  //const [newQuestion, setNewQuestion] = useState('')
  const { title, questions } = useRoom(roomId)

  const [modalRemoveQuestionOpen, setModalRemoveQuestionOpen] = useState("");
  const [modalRemoveRoomOpen, setModalRemoveRoomOpen] = useState(false);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })
    history.push('/')
  }

  //Novo
  function handleRequestDeleteQuestion(questionId: string) {
    setModalRemoveQuestionOpen(questionId);
  }

   /*  
  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir essa pergunta?')){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }
  */
  
  async function handleDeleteQuestion() {
    await database
      .ref(`rooms/${roomId}/questions/${modalRemoveQuestionOpen}`)
      .remove();
    setModalRemoveQuestionOpen("");
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    })
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted: true
    })
  }
  
  return(
    <div id="page-room">
      
      <ModalRemove
        title="Excluir pergunta"
        description="Tem certeza que você deseja excluir esta pergunta?"
        buttonText="Sim, excluir"
        iconSrc={trashRedImg}
        isOpen={Boolean(modalRemoveQuestionOpen)}
        handleRemove={handleDeleteQuestion}
        setIsOpen={() =>
          setModalRemoveQuestionOpen(
            modalRemoveQuestionOpen ? "" : modalRemoveQuestionOpen
          )
        }
      />

      <ModalRemove
        title="Encerrar sala"
        description="Tem certeza que você deseja encerrar esta sala?"
        buttonText="Sim, encerrar"
        iconSrc={closeImg}
        isOpen={modalRemoveRoomOpen}
        handleRemove={handleEndRoom}
        setIsOpen={() => setModalRemoveRoomOpen(!modalRemoveRoomOpen)}
      />

      <header>
        <div className="content">
          <img className="logo-responsivo" src={logoImg} alt="Letmeask" />
          <div className="responsive">
            <RoomCode code={roomId}/>
            <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
          </div>
        </div>
      </header>

      <main id="content">
        <div className="room-title">   
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
          <Link className="see-how-mobile" to={`/rooms/${roomId}`}>
            Ver como participante
          </Link>
        </div> 
          
        <div className="question-list">
          
          {questions.map(question =>{
            return (
              <Question 
              key={question.id}
              content={question.content}
              author={question.author}
              isAnswered={question.isAnswered}
              isHighLighted={question.isHighLighted}
              >
                {!question.isAnswered &&(
                  <>
                    <button
                    type="button"
                    onClick={() => handleCheckQuestionAsAnswered(question.id)} 
                    >
                     <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>
                    <button
                    type="button"
                    onClick={() => handleHighlightQuestion(question.id)} 
                    >
                      <img src={answerImg} alt="Dar destaque a pergunta" />
                    </button>
                  </>
                )}
                <button
                type="button"
                onClick={() => handleRequestDeleteQuestion(question.id)} 
                >
                  <img src={deleteImg} alt="Remover Perguntas" />
                </button>
              </Question>
              
            )
          })}
        </div>
      </main>
    </div>
  )
}