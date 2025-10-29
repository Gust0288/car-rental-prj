-- Cars table for car_rental_db database
CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    city_mpg INT,
    class TEXT,
    combination_mpg INT,
    cylinders INT,
    displacement DECIMAL(3,1),
    drive TEXT,
    fuel_type TEXT,
    highway_mpg INT,
    make TEXT,
    model TEXT,
    transmission TEXT,
    year INT,
    img_path TEXT,
    car_location TEXT
);

INSERT INTO cars (
    city_mpg, class, combination_mpg, cylinders, displacement, drive,
    fuel_type, highway_mpg, make, model, transmission, year, img_path, car_location
) VALUES
(18, 'midsize car', 21, 4, 2.2, 'fwd', 'gas', 26, 'toyota', 'camry', 'a', 1993, 'https://cdn.imagin.studio/getImage?make=toyota&modelFamily=camry&year=1993&angle=front', 'Copenhagen'),
(27, 'compact car', 30, 4, 1.8, 'fwd', 'gas', 36, 'honda', 'civic', 'm', 2018, 'https://cdn.imagin.studio/getImage?make=honda&modelFamily=civic&year=2018&angle=front', 'Aarhus'),
(23, 'suv', 26, 4, 2.5, 'awd', 'gas', 31, 'toyota', 'rav4', 'a', 2020, 'https://cdn.imagin.studio/getImage?make=toyota&modelFamily=rav4&year=2020&angle=front', 'Odense'),
(21, 'pickup truck', 24, 6, 3.3, 'rwd', 'gas', 28, 'ford', 'f-150', 'a', 2019, 'https://cdn.imagin.studio/getImage?make=ford&modelFamily=f-150&year=2019&angle=front', 'Copenhagen'),
(30, 'compact car', 33, 4, 2.0, 'fwd', 'gas', 40, 'mazda', 'mazda3', 'm', 2021, 'https://cdn.imagin.studio/getImage?make=mazda&modelFamily=mazda3&year=2021&angle=front', 'Aarhus'),
(22, 'luxury suv', 25, 6, 3.0, 'awd', 'gas', 29, 'bmw', 'x5', 'a', 2020, 'https://cdn.imagin.studio/getImage?make=bmw&modelFamily=x5&year=2020&angle=front', 'Odense'),
(28, 'hatchback', 32, 4, 1.6, 'fwd', 'gas', 38, 'hyundai', 'elantra', 'a', 2017, 'https://cdn.imagin.studio/getImage?make=hyundai&modelFamily=elantra&year=2017&angle=front', 'Copenhagen'),
(24, 'sedan', 27, 4, 2.0, 'fwd', 'hybrid', 33, 'kia', 'optima', 'a', 2016, 'https://cdn.imagin.studio/getImage?make=kia&modelFamily=optima&year=2016&angle=front', 'Aarhus'),
(20, 'luxury sedan', 23, 6, 3.0, 'awd', 'gas', 28, 'audi', 'a6', 'a', 2021, 'https://cdn.imagin.studio/getImage?make=audi&modelFamily=a6&year=2021&angle=front', 'Odense'),
(31, 'compact car', 34, 3, 1.5, 'fwd', 'gas', 41, 'mini', 'cooper', 'm', 2019, 'https://cdn.imagin.studio/getImage?make=mini&modelFamily=cooper&year=2019&angle=front', 'Copenhagen'),
(33, 'electric', 118, 0, 0.0, 'rwd', 'electric', 113, 'tesla', 'model 3', 'a', 2021, 'https://cdn.imagin.studio/getImage?make=tesla&modelFamily=model3&year=2021&angle=front', 'Aarhus'),
(16, 'muscle car', 19, 8, 5.7, 'rwd', 'gas', 25, 'dodge', 'challenger', 'a', 2018, 'https://cdn.imagin.studio/getImage?make=dodge&modelFamily=challenger&year=2018&angle=front', 'Odense'),
(29, 'compact suv', 32, 4, 2.0, 'awd', 'gas', 35, 'subaru', 'forester', 'cvt', 2020, 'https://cdn.imagin.studio/getImage?make=subaru&modelFamily=forester&year=2020&angle=front', 'Copenhagen'),
(25, 'wagon', 28, 4, 2.0, 'awd', 'gas', 33, 'volvo', 'v60', 'a', 2019, 'https://cdn.imagin.studio/getImage?make=volvo&modelFamily=v60&year=2019&angle=front', 'Aarhus'),
(28, 'compact suv', 31, 4, 1.5, 'fwd', 'gas', 34, 'chevrolet', 'equinox', 'a', 2018, 'https://cdn.imagin.studio/getImage?make=chevrolet&modelFamily=equinox&year=2018&angle=front', 'Odense'),
(19, 'suv', 22, 6, 3.5, 'awd', 'gas', 27, 'nissan', 'pathfinder', 'cvt', 2020, 'https://cdn.imagin.studio/getImage?make=nissan&modelFamily=pathfinder&year=2020&angle=front', 'Copenhagen'),
(27, 'sedan', 30, 4, 2.0, 'fwd', 'gas', 36, 'volkswagen', 'jetta', 'm', 2017, 'https://cdn.imagin.studio/getImage?make=volkswagen&modelFamily=jetta&year=2017&angle=front', 'Aarhus'),
(23, 'sports car', 25, 6, 3.7, 'rwd', 'gas', 28, 'nissan', '370z', 'm', 2019, 'https://cdn.imagin.studio/getImage?make=nissan&modelFamily=370z&year=2019&angle=front', 'Odense'),
(24, 'luxury sedan', 27, 4, 2.0, 'rwd', 'gas', 32, 'mercedes-benz', 'c-class', 'a', 2020, 'https://cdn.imagin.studio/getImage?make=mercedes-benz&modelFamily=c-class&year=2020&angle=front', 'Copenhagen'),
(26, 'compact suv', 29, 4, 1.5, 'awd', 'gas', 33, 'honda', 'cr-v', 'cvt', 2021, 'https://cdn.imagin.studio/getImage?make=honda&modelFamily=cr-v&year=2021&angle=front', 'Aarhus');
