import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Home } from './page/home';
import { Room } from './page/room';
import { WaitingRoom } from './page/waiting-room';
import Game from './page/app';
import { path } from './constant/router';
import { RulesCarousel } from './componant/rules/Rules';

const Application = (): JSX.Element => {
    const pages: Array<{ path: string; element: JSX.Element }> = [
        {
            path: `/game${path.home}`,
            element: <Home />
        },
        {
            path: `/game${path.room}`,
            element: <Room />
        },
        {
            path: `/game${path.waiting_room}/:id`,
            element: <WaitingRoom />
        },
        {
            path: `/game${path.game}/:id`,
            element: <Game />
        },
        {
            path: `/game${path.rules}`,
            element: <RulesCarousel />
        }
    ];

    return (
        <Router>
            <div id="app" className="width-100 height-100">
                <Routes>
                    {pages.map((page, i) => (
                        <Route key={`page-${i}`} path={`${page.path}`} element={page.element} />
                    ))}
                </Routes>
            </div>
        </Router>
    );
};

export default Application;
