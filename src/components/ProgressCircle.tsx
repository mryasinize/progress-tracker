import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useAppContext } from '../context/AppContext';

const ProgressCircle = ({ progress }: { progress: number }) => {
  const { isDarkMode } = useAppContext();
  const getColor = () => {
    if (progress < 50) {
      return {
        path: '#FF7272',
        trail: 'rgba(255, 114, 114, 0.27)',
        background: 'rgba(255, 114, 114, 0.10)'
      };
    } else if (progress < 75) {
      return {
        path: '#FFCC00',
        trail: 'rgba(255, 204, 0, 0.27)',
        background: 'rgba(255, 204, 0, 0.10)'
      };
    } else {
      return {
        path: '#49D287',
        trail: 'rgba(73, 210, 135, 0.27)',
        background: 'rgba(73, 210, 135, 0.10)'
      };
    }
  }
  return <CircularProgressbar
    value={Math.round(progress)}
    text={`${Math.round(progress)}%`}
    background={progress != 0}
    styles={buildStyles({
      pathColor: getColor().path,
      textColor: progress === 0 ? '#d6d6d6' : getColor().path,
      trailColor: progress === 0 ? (isDarkMode ? 'rgb(255 255 255 / 0.17)' : 'rgb(0 0 0 / 0.1)') : getColor().trail,
      backgroundColor: getColor().background
    })}
  />
};

export default ProgressCircle;