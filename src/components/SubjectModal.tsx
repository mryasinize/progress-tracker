import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from "../context/AppContext";
import ProgressCircle from "./ProgressCircle";

export default function SubjectModal({ subjectId = null, onClose }: { subjectId: string | null, onClose: () => void }) {
    const { subjects, dispatch } = useAppContext()
    const [tempSubjectId, setTempSubjectId] = useState(subjectId);
    const isNew = !tempSubjectId
    const subjectInfo = subjects.find(subject => subject.id === tempSubjectId)!
    let totalProgress = 0;
    if (!isNew) {
        totalProgress = subjectInfo.chapters.reduce((total, chapter) => total + (chapter.completed ? 1 : 0), 0) / subjectInfo.chapters.length * 100 || 0;
    }
    const [shouldOverflow, setShouldOverflow] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
    const [tempSubjectName, setTempSubjectName] = useState<string>(isNew ? '' : subjectInfo.name)
    const [tempChapterName, setTempChapterName] = useState<string>('');
    const [newChapterName, setNewChapterName] = useState('');
    const [showNewInput, setShowNewInput] = useState(false)
    const [showSubjectNameInput, setShowSubjectNameInput] = useState(isNew)

    const openEditingInputBox = (chapterId: string, name: string) => {
        setEditingChapterId(chapterId);
        setTempChapterName(name);
    }

    const handleSubjectNameChange = () => {
        if (isNew) {
            const newSubjectId = uuidv4();
            dispatch({
                type: 'ADD_SUBJECT',
                payload: {
                    id: newSubjectId,
                    name: tempSubjectName,
                    chapters: []
                }
            })
            setTempSubjectId(newSubjectId)
        } else {
            dispatch({
                type: 'UPDATE_SUBJECT',
                payload: {
                    subjectId: subjectInfo.id,
                    updates: {
                        name: tempSubjectName
                    }
                }
            })
        }
        setShowSubjectNameInput(false)
    }

    const handleChapterAdd = () => {
        if (newChapterName.trim() !== '') {
            dispatch({
                type: 'ADD_CHAPTER',
                payload: {
                    subjectId: subjectInfo.id,
                    chapterInfo: {
                        id: uuidv4(),
                        name: newChapterName,
                        completed: false
                    }
                }
            })
            setNewChapterName('');
        }
    };

    const handleChapterDelete = (chatperId: string) => {
        dispatch({
            type: 'DELETE_CHAPTER',
            payload: {
                subjectId: subjectInfo.id,
                chapterId: chatperId
            }
        })
    };

    const handleChapterEdit = (chapterId: string, updates: any) => {
        dispatch({
            type: 'UPDATE_CHAPTER',
            payload: {
                subjectId: subjectInfo.id,
                chapterId: chapterId,
                updates: updates
            }
        })
        setTempChapterName('');
        setEditingChapterId(null);
    };
    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const innerHeight = document.getElementById('root')!.clientHeight
        const resizeObserver = new ResizeObserver(() => {
            setShouldOverflow(container.clientHeight >= innerHeight);
        });

        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);
    return <div onClick={onClose} className={clsx(
        "bg-black bg-opacity-[0.3] inset-0 absolute z-10 __center overflow-auto",
        shouldOverflow && "sm:items-baseline sm:py-8"
    )}>
        <div onClick={(e) => e.stopPropagation()} ref={containerRef} className="p-6 sm:h-fit sm:max-w-[600px] sm:rounded-xl shadow-xl sm:mx-6 w-full h-full bg-white overflow-auto">
            <header className="flex items-center justify-between mb-6">
                <div className="truncate">
                    {showSubjectNameInput ?
                        <div className="flex items-center justify-between">
                            <input autoFocus value={tempSubjectName} onChange={(e) => setTempSubjectName(e.target.value)} placeholder="Subject Name" className="py-1 px-3 mr-4 border border-gray-300 rounded-md outline-none w-full" />
                            <div className="flex gap-2 items-center">
                                <button onClick={handleSubjectNameChange}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                </button>
                                <button disabled={isNew} onClick={() => {
                                    setShowSubjectNameInput(false)
                                    setTempSubjectName(subjectInfo.name)
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        :
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-medium">{tempSubjectName}</span>
                            <button className="text-base" onClick={() => setShowSubjectNameInput(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </button>
                        </div>
                    }
                </div>
                <button className="ml-4" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </header>
            <div className="h-auto text-black">
                <div className="size-44 mx-auto">
                    <ProgressCircle progress={totalProgress} />
                </div>
                <div className="mt-6">
                    <div>
                        <span className="text-gray-500 text-xl font-semibold">Chapters</span>
                    </div>
                    <ul className="mt-2">
                        {!isNew && subjectInfo.chapters.length > 0 ? subjectInfo.chapters.map(chapter =>
                            <li key={chapter.id}>
                                <div className="flex items-center justify-between min-h-11">
                                    <input
                                        className="size-5 cursor-pointer"
                                        type="checkbox"
                                        checked={chapter.completed}
                                        onChange={() => handleChapterEdit(chapter.id, { completed: !chapter.completed })}
                                    />
                                    <div className="flex-1 mx-4">
                                        {editingChapterId === chapter.id ?
                                            <input
                                                autoFocus
                                                placeholder="Chapter Name"
                                                className="border border-gray-300 text-gray-900 rounded-md outline-none w-full px-3 py-1"
                                                value={tempChapterName}
                                                onChange={(e) => setTempChapterName(e.target.value)}
                                            />
                                            : chapter.completed ? <del>{chapter.name}</del> : <span>{chapter.name}</span>
                                        }
                                    </div>
                                    {editingChapterId === chapter.id ?
                                        <div className="flex gap-4 items-center">
                                            <button onClick={() => handleChapterEdit(chapter.id, { name: tempChapterName })}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                </svg>
                                            </button>
                                            <button onClick={() => setEditingChapterId(null)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div> :
                                        <div className="flex gap-4 items-center">
                                            <button onClick={() => openEditingInputBox(chapter.id, chapter.name)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                </svg>
                                            </button>
                                            <button className="text-red-500" onClick={() => handleChapterDelete(chapter.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    }
                                </div>
                            </li>
                        ) : !showNewInput &&
                        <span className="text-gray-500 block my-5">Add some chapters to get started.</span>
                        }
                    </ul>
                    <div className="mt-2">
                        {!isNew && showNewInput ?
                            <div className="flex items-center justify-between">
                                <input autoFocus value={newChapterName} onChange={(e) => setNewChapterName(e.target.value)} placeholder="Chapter Name" className="px-3 py-1.5 mr-4 border border-gray-300 text-gray-900 rounded-md outline-none w-full" />
                                <div className="flex gap-4 items-center">
                                    <button onClick={handleChapterAdd}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>
                                    </button>
                                    <button onClick={() => {
                                        setShowNewInput(false)
                                        setNewChapterName('')
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            : <button disabled={isNew} className="disabled:cursor-not-allowed disabled:opacity-50 font-medium flex items-center gap-1 text-blue-500 bg-blue-50 px-3 py-1.5 rounded-md" onClick={() => setShowNewInput(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Add chapter
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>

}
