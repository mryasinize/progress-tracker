import { useState } from 'react';
import ProgressCircle from './components/ProgressCircle';
import SubjectCard from './components/SubjectCard';
import SubjectModal from './components/SubjectModal';
import { useAppContext } from './context/AppContext';
import Timer from './components/Timer';

function App() {
  const { subjects, totalProgress, dispatch } = useAppContext();
  const [openSubjectModal, setOpenSubjectModal] = useState(false)
  const [currentSubjectId, setCurrentSubjectId] = useState<string | null>(null)
  return <div id='root' className='bg-white flex flex-col relative m-auto h-screen overflow-hidden'>
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
