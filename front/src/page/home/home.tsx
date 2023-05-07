// Home page to set the username
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState } from '../../componant/Context';
import { emit } from '../../utils/socket';
import './home.css';
import { path } from '../../constant/router';
import { useSpring, animated, config } from 'react-spring';
import { warnLog } from '../../utils/logger';

const AnimatedLetter = ({ letter }) => {
    const animation = useSpring({
        from: {
            transform: `translate3d(${Math.random() * 100 - 50}vw, ${Math.random() * 100 - 50}vh, 0)`,
        },
        to: {
            transform: 'translate3d(0, 0, 0)',
        },
        config: config.wobbly,
    });

    return (
        <animated.span style={{ ...animation, position: 'relative', display: 'inline-block' }}>
            {letter}
        </animated.span>
    );
};

const AnimatedTitle = () => {
    const title = "DIAMANT";

    return (
        <h1 className="main-page-title" style={{ position: 'relative' }}>
            {title.split('').map((letter, index) => (
                <AnimatedLetter key={index} letter={letter} />
            ))}
        </h1>
    );
};


function Home() {
    const [username, setUsername] = useState('');
    const { socket, setUser } = AppState();
    const navigate = useNavigate();

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUsername(event.target.value);
    };

    const handleUsernameSubmit = (): void => {
        emit(socket, 'set-username', username);
    };

    useEffect(() => {
        if (socket == null) {
            return;
        }

        socket.on('set-username-success', (): void => {
            setUser(username);
            navigate(path.room);
        });

        socket.on('disconnect', () => {
            warnLog('Socket disconnected')
            navigate(path.home);
        });
    }, [socket]);



    return (
        <div className="main-page">
            <AnimatedTitle />

            <input
                className="username-input"
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                value={username}
                onChange={handleUsernameChange}
            />

            <button className="play-button" onClick={handleUsernameSubmit}>
                PLAY
            </button>

            <div className="rule-button" onClick={() => navigate(path.rules)}>
                {'voir les règles ->'}
            </div>
        </div>
    );
}

export { Home };
