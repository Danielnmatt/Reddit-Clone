import {render, screen} from '@testing-library/react';
import Banner from './src/components/banner.jsx';
import {BrowserRouter} from 'react-router-dom';

test('Create Post button disabled for guests', () => {
    const guest = {
        user: {
            displayName: "guest",
            email: null
        },
    };

    render(
        <BrowserRouter>
            <Banner 
                allData={guest}
                allOpeners={{}}
                allUpdaters={{}}
            />
        </BrowserRouter>
    );

    const createPostButton = screen.getByText("Create New Post");
    expect(createPostButton).toBeDisabled();
});

test('Create Post button enabled for registered users', () => {
    const testUser = {
        user: {
            displayName: "testuser",
            email: "test@test.com"
        },
    };

    render(
        <BrowserRouter>
            <Banner 
                allData={testUser}
                allOpeners={{}}
                allUpdaters={{}}
            />
        </BrowserRouter>
    );

    const createPostButton = screen.getByText("Create New Post");
    expect(createPostButton).toBeEnabled();
});