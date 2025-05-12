import {render, screen, cleanup, fireEvent} from '@testing-library/react';
import {UserContext} from './src/userContext';
import App from './src/App';

describe('Create Post Button Tests', () => {
    afterEach(() => {
        cleanup();
    });

    test('Create Post button should be disabled for guest users', async () => {
    const guestUser = { displayName: "guest", email: null, id: null, userVotes: null, reputation: null, accountCreationDate: null, role: "user"};
    
    render(
        <UserContext.Provider value={{ user: guestUser }}>
            <App />
        </UserContext.Provider>
    );

    const guestButton = await screen.findByRole('link', {name: /continue as guest/i});
    fireEvent.click(guestButton);
    
    const createPostButton = await screen.findByRole('button', {name: /create new post/i});
    expect(createPostButton).toBeDisabled();
});

    test('Create Post button should be enabled for registered users', async () => {
        const registeredUser = { displayName: "tester", email: "tester@testing.com", id: "abdeffbdaff", userVotes: [], reputation: 100, accountCreationDate: Date.now(), role: "user"};
        render(
            <UserContext.Provider value={{ user: registeredUser }}>
                <App />
            </UserContext.Provider>
        );
        const createPostButton = await screen.findByRole('button', {name: /create new post/i});
        expect(createPostButton).not.toBeDisabled();
    });
});