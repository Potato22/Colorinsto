import { jest } from '@jest/globals';
import $ from 'jquery';
import { sceneHandler } from '../internals/js/sceneHandler';
import { toastPush, toastDismiss } from '../toaster/toast';

jest.mock('jquery', () => ({
    ...jest.requireActual('jquery'),
    fadeIn: jest.fn(),
    addClass: jest.fn(),
    removeClass: jest.fn(),
    hide: jest.fn(),
    show: jest.fn(),
}));

jest.mock('../../toaster/toast', () => ({
    toastPush: jest.fn(),
    toastDismiss: jest.fn(),
}));

describe('sceneHandler', () => {
    let sceneTitle, sceneCameraPriming, scenePlayground;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="titleSc"></div>
            <div id="camModSc"></div>
            <div id="playgroundSc"></div>
        `;

        sceneTitle = $('#titleSc');
        sceneCameraPriming = $('#camModSc');
        scenePlayground = $('#playgroundSc');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handle scene 0', () => {
        sceneHandler(0);

        expect(sceneTitle.fadeIn).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('currentScene', 0);
    });

    it('should handle scene 1', () => {
        sceneHandler(1);

        expect(sceneTitle.addClass).toHaveBeenCalledWith('SCRIPT-sceneOutScaleUp');
        expect(toastPush).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "Before we delve in...",
                text: "Do you want to go through an introduction?",
            }),
            expect.objectContaining({
                tone: 'bounce',
                forceVerticalButtons: true,
            })
        );
        expect(console.log).toHaveBeenCalledWith('currentScene', 1);
    });

    it('should handle scene 2', () => {
        sceneHandler(2);

        expect(toastPush).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "Generate more in the playground",
                text: "Change your color, select your color harmony, and press regenerate (<span class='material-symbols-rounded'>replay</span>)"
            }),
            expect.objectContaining({
                tone: 'fade',
                position: "bottom",
                interactive: true,
            })
        );
        expect(sceneTitle.addClass).toHaveBeenCalledWith('SCRIPT-sceneOutScaleDown');
        expect(sceneCameraPriming.removeClass).toHaveBeenCalledWith('SCRIPT-sceneInScaleUp');
        expect(sceneCameraPriming.addClass).toHaveBeenCalledWith('SCRIPT-sceneOutDown');

        jest.advanceTimersByTime(1000);

        expect(sceneTitle.hide).toHaveBeenCalled();
        expect(sceneTitle.removeClass).toHaveBeenCalledWith('SCRIPT-sceneOutScaleDown');
        expect(sceneCameraPriming.hide).toHaveBeenCalled();
        expect(sceneCameraPriming.removeClass).toHaveBeenCalledWith('SCRIPT-sceneOutDown');
        expect(scenePlayground.show).toHaveBeenCalled();
        expect(scenePlayground.addClass).toHaveBeenCalledWith('SCRIPT-sceneInUp');
        expect(console.log).toHaveBeenCalledWith('currentScene', 2);
    });

    it('should handle default case', () => {
        window.alert = jest.fn();
        sceneHandler(999);

        expect(window.alert).toHaveBeenCalledWith('eh?');
        expect(console.log).toHaveBeenCalledWith('currentScene', 0);
    });
});