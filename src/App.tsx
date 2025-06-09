import { useState } from 'react';
import ProgressCircle from './components/ProgressCircle';
import SubjectCard from './components/SubjectCard';
import SubjectModal from './components/SubjectModal';
import { useAppContext } from './context/AppContext';
import Timer from './components/Timer';

function App() {
  const { subjects, totalProgress, isDarkMode, dispatch, setIsDarkMode } = useAppContext();
  const [openSubjectModal, setOpenSubjectModal] = useState(false)
  const [currentSubjectId, setCurrentSubjectId] = useState<string | null>(null)

  const toggleDarkMode = () => {
    document.querySelector('html').classList.toggle('dark')
    setIsDarkMode(!isDarkMode)
  }

  return <div id='root' className='bg-white dark:bg-black flex flex-col relative m-auto h-screen overflow-hidden'>
    {openSubjectModal &&
      <SubjectModal
        subjectId={currentSubjectId}
        onClose={() => {
          setOpenSubjectModal(false)
          setCurrentSubjectId(null)
        }} />
    }
    <div className='flex flex-col items-center my-10 gap-4'>
      <div className="size-48 __center mx-auto">
        <ProgressCircle progress={totalProgress} />
      </div>
      <Timer />
      <span className='text-gray-400'>Total: {subjects.length} {subjects.length === 1 ? "Subject" : "Subjects"}</span>
      <button onClick={toggleDarkMode} title={isDarkMode ? "Switch to light Mode" : "Switch to dark Mode"} className='text-black outline-none dark:text-white/90 absolute right-10'>
        {isDarkMode ?
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>
          :
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>
        }
      </button>
    </div>
    {subjects.length > 0 ?
      <div className='grid grid-cols-3 gap-4 p-6 pt-0 overflow-auto'>
        {subjects.map(subject =>
          <SubjectCard
            key={subject.id}
            subjectInfo={subject}
            onClick={() => {
              setCurrentSubjectId(subject.id)
              setOpenSubjectModal(true)
            }}
            onDelete={() => {
              dispatch({
                type: 'DELETE_SUBJECT',
                payload: {
                  id: subject.id
                }
              })
            }}
          />
        )}
      </div>
      :
      <div className='m-6 __center h-full'>
        <span className='text-gray-500 mx-auto block'>Add subjects to get started</span>
      </div>
    }
    <button onClick={() => setOpenSubjectModal(true)} className='absolute bottom-7 right-7 shadow-lg active:scale-95 rounded-full bg-blue-500 text-white size-12 __center'>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>
  </div>
}

export default App
