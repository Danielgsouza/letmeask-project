import { useEffect, useState } from "react"
import { useHistory } from 'react-router-dom'
import { toast } from "react-toastify"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"


type FirebaseQuestions = Record<string, {
    author: {
      name: string
      avatar: string
    }
    content: string
    isAnswered: boolean
    isHighLighted: boolean
    likes: Record<string, {
      authorId: string
    }>
  }>

type QuestionType = {
    id: string
    author: {
      name: string
      avatar: string
    }
    content: string
    isAnswered: boolean
    isHighLighted: boolean
    likeCount: number
    likeId: string | undefined
    
  }
// eslint-disable-next-line
  type useRoomRetorn = {
    roomAuthorId: string
  }

export function useRoom (roomId: string) {
    const history = useHistory()
    const { user } = useAuth()
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')
    const [ roomAuthorId, setRoomAuthorId ] = useState('')

    useEffect(() =>{
        const roomRef = database.ref(`rooms/${roomId}`)

        roomRef.on('value', room => {
          
          const roomExist = room.exists()

          if(!roomExist) {
            toast.error('Sala Não Encontrada!')
            return history.replace('/')
          }

          const databaseRoom = room.val()

          if(databaseRoom.endedAt) {
            toast.error('Está sala já foi encerrada!')
            return history.replace('/')
          }


          const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}
    
          const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
            return {
              id: key,
              content: value.content,
              author: value.author,
              isHighLighted: value.isHighLighted,
              isAnswered: value.isAnswered,
              likeCount: Object.values(value.likes ?? {}).length,
              likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
    
            }
          })
          setTitle(databaseRoom.title)
          setRoomAuthorId(databaseRoom.authorId)
          setQuestions(parsedQuestions)
        })
        return () => {
          roomRef.off('value')
        }

    }, [ roomAuthorId, history,  roomId, user?.id])

      return { questions, title, roomAuthorId }
}