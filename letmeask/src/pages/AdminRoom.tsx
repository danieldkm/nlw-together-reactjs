import { FormEvent, useState } from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Button} from '../components/Button'
import {RoomCode} from '../components/RoomCode'
import {Question} from '../components/Question'
import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'

import '../styles/room.scss'
import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'


type RoomParams = {
  id: string;
}
export function AdminRoom() {
  // const {user} = useAuth()
  const history = useHistory()
  const params = useParams<RoomParams>()
  // const [newQuestion, setNewQuestion] = useState('')
  
  const roomId = params.id

  const {questions, title} = useRoom(roomId)

  async function handleEndRoom(): Promise<void> {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string): Promise<void> {
    if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId }/>
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1> 
          {
            questions.length > 0 && <span>{questions.length} pergunta(s)</span>
          }
        </div>

        <div className="question-list">
          {
            questions.map(question => {
              return (
                <Question 
                  key={question.id}
                  author={question.author}
                  content={question.content}
                >
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <img src={deleteImg} alt="Remover pergunta" />
                  </button>
                  </Question>
              )
            })
          }
        </div>
      </main>
    </div>
  )
}
