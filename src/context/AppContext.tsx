import { createContext, useContext, useEffect, useReducer, useState } from "react";

export interface Subject {
    id: string
    name: string
    chapters: Chapter[]
}

interface Chapter {
    id: string
    name: string
    completed: boolean
}

type Action =
    {
        type: 'LOAD_SUBJECTS'
        payload: Subject[]
    }
    | {
        type: 'ADD_SUBJECT'
        payload: Subject
    } | {
        type: 'UPDATE_SUBJECT'
        payload: { subjectId: string, updates: Partial<Subject> }
    } | {
        type: 'DELETE_SUBJECT'
        payload: { id: string }
    } | {
        type: 'ADD_CHAPTER'
        payload: { subjectId: string, chapterInfo: Chapter }
    } | {
        type: 'UPDATE_CHAPTER'
        payload: { subjectId: string, chapterId: string, updates: Partial<Chapter> }
    } | {
        type: 'DELETE_CHAPTER'
        payload: { subjectId: string, chapterId: string }
    }

const AppContext = createContext<{ subjects: Subject[], totalProgress: number, dispatch: React.Dispatch<Action>, deadline: string | null, setDeadline: React.Dispatch<React.SetStateAction<string | null>> }>({ subjects: [], totalProgress: 0, dispatch: () => { } })

export default function AppContextProvider({ children }: { children: React.ReactNode }) {
    const [subjects, dispatch] = useReducer(contextReducer, [])
    const [deadline, setDeadline] = useState<string | null>(null)
    const [totalProgress, setTotalProgress] = useState(0)
    const [isLoadingApplicationState, setIsLoadingApplicationState] = useState(true)

    useEffect(() => {
        (async () => {
            const applicationState = await window.electronAPI.getApplicationState()
            if (applicationState) {
                dispatch({ type: 'LOAD_SUBJECTS', payload: applicationState.subjects })
                setTotalProgress(applicationState.totalProgress)
                setDeadline(applicationState.deadline)
            }
            setIsLoadingApplicationState(false)
        })()
    }, [])

    useEffect(() => {
        if (!isLoadingApplicationState) {
            const totalChapters = subjects.reduce((sum, subject) => sum + subject.chapters.length, 0);
            const completedChapters = subjects.reduce(
                (sum, subject) => sum + subject.chapters.filter((chapter) => chapter.completed).length,
                0
            );
            const overallProgress = Math.round((completedChapters / totalChapters) * 100) || 0;
            setTotalProgress(overallProgress)
            window.electronAPI.saveApplicationState({ subjects, totalProgress: overallProgress, deadline })
        }
    }, [subjects, deadline])

    return isLoadingApplicationState ? null :
        <AppContext.Provider value={{ subjects, dispatch, totalProgress, deadline, setDeadline }}>
            {children}
        </AppContext.Provider>
}

export const useAppContext = () => {
    if (!AppContext) {
        throw new Error('AppContext cannot be null')
    }
    return useContext(AppContext)
}

const contextReducer = (subjects: Subject[], action: Action) => {
    switch (action.type) {
        case 'LOAD_SUBJECTS': {
            return action.payload
        }
        case 'ADD_SUBJECT': {
            return [...subjects, action.payload]
        }
        case 'UPDATE_SUBJECT': {
            return subjects.map((subject) => {
                if (subject.id === action.payload.subjectId) {
                    return { ...subject, ...action.payload.updates }
                }
                return subject
            })
        }
        case 'DELETE_SUBJECT': {
            return subjects.filter((subject) => subject.id !== action.payload.id)
        }
        case 'ADD_CHAPTER': {
            return subjects.map(subject => {
                if (subject.id === action.payload.subjectId) {
                    return {
                        ...subject,
                        chapters: [...subject.chapters, action.payload.chapterInfo]
                    }
                }
                return subject
            })
        }
        case 'UPDATE_CHAPTER': {
            return subjects.map(subject => {
                if (subject.id === action.payload.subjectId) {
                    return {
                        ...subject,
                        chapters: subject.chapters.map(chapter => {
                            if (chapter.id === action.payload.chapterId) {
                                return { ...chapter, ...action.payload.updates }
                            }
                            return chapter
                        })
                    }
                }
                return subject
            })
        }
        case 'DELETE_CHAPTER': {
            return subjects.map(subject => {
                if (subject.id === action.payload.subjectId) {
                    return {
                        ...subject,
                        chapters: subject.chapters.filter(chapter => chapter.id !== action.payload.chapterId)
                    }
                }
                return subject
            })
        }
        default:
            throw new Error('Invalid action type')
    }
}