CREATE DATABASE geservice;
USE geservice;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'professional', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    address TEXT,
    city VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE professionals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    profession VARCHAR(100),
    phone varchar(100),
    bio TEXT,
    city VARCHAR(100),
    zone_intervention TEXT,
    address varchar(100),
    is_verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE availabilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  day_of_week ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE services (
	id INT AUTO_INCREMENT PRIMARY KEY,
    professional_id   INT NOT NULL,
    service VARCHAR(150)  NOT NULL,      
    description       TEXT          NULL, 
    prix             DECIMAL(10,2) NOT NULL,
    
    CONSTRAINT fk_services_professional
        FOREIGN KEY (professional_id)
        REFERENCES professionals(user_id)
        ON DELETE CASCADE,
        
	INDEX idx_services_professional  (professional_id)
);

CREATE TABLE Location (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, 
    adresse VARCHAR(255), -- Adresse lisible
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);



CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    professional_id INT NOT NULL,
    service VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'accepted', 'refused', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    price DECIMAL(10, 2),

    -- Clés étrangères
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (professional_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    professional_id INT NOT NULL,
    client_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_replied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (professional_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE users 
ADD COLUMN status ENUM('actif', 'inactif') NOT NULL DEFAULT 'actif' 
AFTER role;

INSERT INTO users (firstname, lastname, email, password, role)
VALUES ('nafis', 'TOURE', 'nafis@gmail.com', '$2b$10$RHg7fnqCE75Z9nLL9YcAU.3FoICyGvzg1Ghj6ifHm.FspwlrH/OfC', 'admin');
