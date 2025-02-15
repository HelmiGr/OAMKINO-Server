-- Users table
CREATE TABLE
    Users (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        user_name VARCHAR(255) UNIQUE NOT NULL, --Added user_name
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    groups (
        group_id SERIAL PRIMARY KEY,
        group_name VARCHAR(255) NOT NULL, -- Added group_name column
        owner_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users (user_id) ON DELETE CASCADE -- Delete all if detele users
    );

CREATE TABLE
    GroupMemberships (
        group_id INT REFERENCES Groups (group_id) ON DELETE CASCADE,
        user_id INT REFERENCES Users (user_id) ON DELETE CASCADE,
        role VARCHAR(50) CHECK (role IN ('admin', 'member', 'pending')), -- Roles are separate from status
        status VARCHAR(50) DEFAULT 'pending' CHECK (
            status IN ('pending', 'accepted', 'rejected', 'invited')
        ), -- Membership status
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Tracks when the record was created
        PRIMARY KEY (group_id, user_id)
    );

---add movie in group page table
CREATE TABLE
    GroupMovies (
        id SERIAL PRIMARY KEY,
        group_id INT NOT NULL,
        movie_id VARCHAR(255) NOT NULL,
        added_by INT NOT NULL,
        added_at TIMESTAMP DEFAULT NOW (),
        FOREIGN KEY (group_id) REFERENCES Groups (group_id) ON DELETE CASCADE, 
        FOREIGN KEY (added_by) REFERENCES Users (user_id) ON DELETE CASCADE
    );

-- Movies table
CREATE TABLE
    Movies (
        movie_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        genre VARCHAR(100),
        release_date DATE,
        tmdb_id INT UNIQUE, -- Unique ID from TMDB to avoid duplicates
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Showtimes table with foreign key to Movies
CREATE TABLE
    Showtimes (
        showtime_id SERIAL PRIMARY KEY,
        movie_id INT REFERENCES Movies (movie_id) ON DELETE CASCADE, -- Foreign key to Movies
        theater_location VARCHAR(255),
        showtime TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

--  the Groups table-- 
-- CREATE TABLE groups (
--     group_id SERIAL PRIMARY KEY,             
--     owner_id INT NOT NULL,                  
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
--     FOREIGN KEY (owner_id) REFERENCES users(user_id)  -- Foreign key reference to Users
-- );
-- SELECT 
--     groups.*, 
--     users.name AS owner_name 
-- FROM groups 
-- JOIN users ON groups.owner_id = users.user_id;
-- -- Insert sample data into Users table 
-- INSERT INTO users (name) VALUES 
--     ('John Doe'),
--     ('Jane Smith');
-- -- Insert sample data into Groups table 
-- INSERT INTO groups (group_name, owner_id) VALUES 
--     ('Group A', 1),  
--     ('Group B', 2);  
/*-- Groups table with foreign key to Users (owner_id)
CREATE TABLE Groups (
group_id SERIAL PRIMARY KEY,
group_name VARCHAR(100) NOT NULL,
owner_id INT REFERENCES Users(user_id) ON DELETE CASCADE,  -- Foreign key to Users table
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);*/
-- GroupMemberships join table for many-to-many relationship between Users and Groups
-- CREATE TABLE GroupMemberships (
--     group_id INT REFERENCES Groups(group_id) ON DELETE CASCADE,  -- Foreign key to Groups
--     user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,     -- Foreign key to Users
--     role VARCHAR(50),  -- E.g., 'member' or 'admin'
--     PRIMARY KEY (group_id, user_id)  -- Composite primary key for many-to-many relationship
-- );
-- Reviews table with foreign keys to Movies and Users
CREATE TABLE
    movie_reviews (
        review_id SERIAL PRIMARY KEY,
        review TEXT NOT NULL,
        movie_id INT NOT NULL,
        user_id INT NOT NULL,
        movie_name VARCHAR(255),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
        UNIQUE (movie_id, user_id)
    );

CREATE TABLE
    movie_rating (
        rating_id SERIAL PRIMARY KEY,
        rating INT NOT NULL CHECK (
            rating >= 1
            AND rating <= 5
        ),
        movie_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
        UNIQUE (movie_id, user_id)
    );

CREATE TABLE
    Favorites (
        id serial PRIMARY KEY,
        user_id INT REFERENCES users (user_id) ON DELETE CASCADE,
        movie_id INT NOT NULL,
        UNIQUE (user_id, movie_id)
    );

--New 
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tagged_users JSONB DEFAULT '[]',
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups (group_id) ON DELETE CASCADE
);


-- CREATE TABLE
--     messages (
--         message_id SERIAL PRIMARY KEY,
--         message TEXT NOT NULL,
--         group_id INT NOT NULL,
--         user_id INT NOT NULL,
--         timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--         FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
--     );
