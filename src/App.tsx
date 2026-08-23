import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import weatherData from '../data.json';
import logoIcon from '../icons/weather web logo.svg';
import searchIcon from '../icons/search logo.svg';
import cloudyIcon from '../icons/cloudy icon.svg';
import tempMaxIcon from '../icons/temp max.svg';
import tempMinIcon from '../icons/temp min.svg';
import humidityIcon from '../icons/humadity icon.svg';
import windIcon from '../icons/wind icon.svg';
import snowIcon from '../icons/snow icon.svg';
import snowBg from '../images/snow.svg';
import bgBlur from '../icons/bg-blur.svg';
import clearImg from '../images/clear.jpeg';
import cloudyImg from '../images/cloudy.png';
import rainImg from '../images/rain.jpeg';
import drizzleImg from '../images/drizzle.jpeg';
import thunderstormImg from '../images/thunderstorm.jpeg';
import mistImg from '../images/mist.jpeg';
import geFlag from '../icons/GE.webp';
import ukFlag from '../icons/UK.webp';
import frFlag from '../icons/FR.webp';

const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const BACKGROUND_MAP: Record<string, string> = {
  clear: clearImg,
  cloudy: cloudyImg,
  rain: rainImg,
  drizzle: drizzleImg,
  snow: snowBg,
  storm: thunderstormImg,
  fog: mistImg,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -24 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
};

const welcomeContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.15,
    filter: "blur(10px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const welcomeItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 22 }
  },
};

export default function App() {
  const [selectedCity, setSelectedCity] = useState(weatherData.cities[0]);
  const [selectedDay, setSelectedDay] = useState(weatherData.cities[0].forecast[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isStarted, setIsStarted] = useState(false);

  const sortedForecast = useMemo(() => {
    return [...selectedCity.forecast].sort(
      (a, b) => DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day)
    );
  }, [selectedCity]);

  const currentCondition = selectedDay ? selectedDay.condition : selectedCity.current.condition;
  const currentBgImage = BACKGROUND_MAP[currentCondition] || snowBg;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = weatherData.cities.find(
      (c) => c.name.toLowerCase() === searchTerm.toLowerCase()
    );
    if (found) {
      setSelectedCity(found);
      const sorted = [...found.forecast].sort(
        (a, b) => DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day)
      );
      setSelectedDay(sorted[0]);
      setSearchTerm('');
    } else {
      alert("City not found!");
    }
  };

  const handleCitySelect = (city: typeof weatherData.cities[0]) => {
    setSelectedCity(city);
    const sorted = [...city.forecast].sort(
      (a, b) => DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day)
    );
    setSelectedDay(sorted[0]);
  };

  return (
    <div className="min-h-screen lg:h-screen w-full relative bg-gray-950 text-white overflow-y-auto lg:overflow-hidden selection:bg-white selection:text-black">

      {/* ფონის Crossfade AnimatePresence-ით (0.9წმ) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentCondition}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentBgImage})` }}
          />
        </AnimatePresence>
      </div>

{/* Welcome Screen */}
      <AnimatePresence>
        {!isStarted && (
          <motion.div 
            variants={welcomeContainerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          >
            <motion.div 
              variants={welcomeItemVariants}
              className="flex flex-col items-center text-center p-8 max-w-md mx-4 rounded-3xl bg-white/10 border border-white/20 shadow-2xl backdrop-blur-xl"
            >
              <motion.img variants={welcomeItemVariants} src={logoIcon} alt="Weather Logo" className="w-16 h-auto mb-4 drop-shadow-md" />
              <motion.h1 variants={welcomeItemVariants} className="text-4xl font-light tracking-wide mb-2 text-white">Weather website</motion.h1>
              <motion.p variants={welcomeItemVariants} className="text-sm text-gray-300 mb-6 font-light">
                Discover the most accurate weather forecasts of three cities:
                <br /><br />
                <span className="group relative inline-block px-4 py-1.5 rounded-md bg-white/5 border border-white/10 overflow-hidden cursor-default transition-all duration-300 hover:scale-105">
                  <span className="inline-block transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2 font-bold">
                    LONDON
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <img src={ukFlag} alt="UK" className="w-7 h-5 object-cover rounded shadow-sm" />
                  </span>
                </span>
                <br /><br />
                <span className="group relative inline-block px-4 py-1.5 rounded-md bg-white/5 border border-white/10 overflow-hidden cursor-default transition-all duration-300 hover:scale-105">
                  <span className="inline-block transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2 font-bold">
                    TBILISI
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <img src={geFlag} alt="GE" className="w-7 h-5 object-cover rounded shadow-sm" />
                  </span>
                </span>
                <br /><br />
                <span className="group relative inline-block px-4 py-1.5 rounded-md bg-white/5 border border-white/10 overflow-hidden cursor-default transition-all duration-300 hover:scale-105">
                  <span className="inline-block transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2 font-bold">
                    PARIS
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <img src={frFlag} alt="FR" className="w-7 h-5 object-cover rounded shadow-sm" />
                  </span>
                </span>
              </motion.p>
              <motion.div variants={welcomeItemVariants}>
                <button
                  onClick={() => setIsStarted(true)}
                  className="px-8 py-3 rounded-full bg-white text-black font-medium text-sm transition-all duration-300 hover:bg-gray-100 hover:scale-105 cursor-pointer shadow-lg active:scale-95"
                >
                  To the website
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


{/* DESKTOP VERSION */}


      <div className="hidden lg:block w-full h-full relative z-10">
        
        {/* Header */}
        <header 
          className="absolute z-40 flex justify-between items-center"
          style={{ width: '1182px', top: '40px', left: '121px' }}
        >
          <img src={logoIcon} alt="Weather Logo" style={{ width: '89.89px', height: '47px' }} />

          <div className="absolute -right-58 top-0 flex flex-row items-center gap-4">
            <form onSubmit={handleSearch} className="relative w-72">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Location:"
                className="w-full bg-transparent border-b border-white/50 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-white placeholder-gray-300 rounded-none transition-colors"
              />
              <button type="submit" className="absolute right-0 top-2.5 cursor-pointer">
                <img src={searchIcon} alt="Search" className="w-5 h-5 brightness-0 invert opacity-90" />
              </button>
            </form>

            <div className="flex items-center gap-2 text-xs text-gray-300 whitespace-nowrap">
              {weatherData.cities.map((city) => {
                const isSelected = selectedCity.id === city.id;
                return (
                  <motion.button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    animate={isSelected ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className={`px-3 py-1 rounded-full transition-all duration-300 cursor-pointer border ${
                      isSelected 
                        ? 'bg-white text-black font-semibold border-white shadow-lg' 
                        : 'bg-white/10 hover:bg-white/25 text-white border-white/20'
                    }`}
                  >
                    {city.name}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </header>
        <motion.div 
          key={selectedCity.name + (selectedDay ? selectedDay.date : '')}
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -40, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute z-10 flex items-center gap-6"
          style={{ top: '556px', left: '121px', height: '168px' }}
        >
          <h1 
            className="font-normal text-white"
            style={{ fontSize: '143px', lineHeight: '100%', letterSpacing: '-8%' }}
          >
            {selectedDay ? selectedDay.temperature : selectedCity.current.temperature}°
          </h1>

          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-5xl font-roboto">{selectedCity.name}</h2>
              <p className="text-sm text-gray-200 mt-1">
                {selectedDay ? `${selectedDay.day} - ${selectedDay.date}` : "06:09 - Monday, 9 Sep '23"}
              </p>
            </div>
            <motion.img 
              animate={{ y: [-6, 6, -6] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              src={cloudyIcon} 
              alt="Cloudy" 
              style={{ width: '70px', height: '70px' }} 
            />
          </div>
        </motion.div>


{/* Sidebar */}


        <aside
          className="absolute right-0 top-0 z-20 w-1/3 h-screen border-l border-white/10 px-8 pb-8 pt-28 flex flex-col justify-between bg-cover bg-center"
          style={{ backgroundImage: `url(${bgBlur})`, backdropFilter: 'blur(13px)' }}
        >
          <div className="space-y-6 pt-2">
            <div className="flex flex-wrap gap-2">
              {sortedForecast.map((item, index) => {
                const isDaySelected = selectedDay?.date === item.date;
                return (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedDay(item)}
                    animate={isDaySelected ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer border ${
                      isDaySelected 
                        ? 'bg-white text-black font-semibold border-white' 
                        : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                    }`}
                  >
                    {item.day}
                  </motion.button>
                );
              })}
            </div>

            <motion.div
              key={selectedDay?.date || 'details'}
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={itemVariants}>
                <p className="text-sm text-gray-300 mb-3">Weather Details:</p>
                <h3 className="text-sm font-semibold tracking-wider text-white mb-4 uppercase">
                  {selectedDay ? selectedDay.description : selectedCity.current.description}
                </h3>
              </motion.div>
              
              <div className="space-y-4 text-sm">
                <motion.div variants={itemVariants} className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-300">Temp max</span>
                  <div className="flex items-center gap-3 font-medium">
                    <span>{selectedDay ? selectedDay.tempMax : selectedCity.details.tempMax}°</span>
                    <img src={tempMaxIcon} alt="Temp max" style={{width: '20px', height: '20px'}} />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-300">Temp min</span>
                  <div className="flex items-center gap-3 font-medium">
                    <span>{selectedDay ? selectedDay.tempMin : selectedCity.details.tempMin}°</span>
                    <img src={tempMinIcon} alt="Temp min" style={{width: '20px', height: '20px'}}/>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-300">Humadity</span>
                  <div className="flex items-center gap-3 font-medium">
                    <span>{selectedCity.details.humidity}%</span>
                    <img src={humidityIcon} alt="Humidity" style={{width: '20px', height: '20px'}} />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-300">Cloudy</span>
                  <div className="flex items-center gap-3 font-medium">
                    <span>{selectedCity.details.cloudiness}%</span>
                    <img src={cloudyIcon} alt="Cloudy" style={{width: '20px', height: '20px'}}/>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex justify-between items-center pb-2">
                  <span className="text-gray-300">Wind</span>
                  <div className="flex items-center gap-3 font-medium">
                    <span>{selectedCity.details.wind}km/h</span>
                    <img src={windIcon} alt="Wind" style={{width: '20px', height: '20px'}}/>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <hr className="border-white/20 my-6" />

            <div>
              <p className="text-sm text-gray-300 mb-4">Today's Weather Forecast:</p>
              <div className="space-y-4">
                {sortedForecast.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img src={snowIcon} alt="Snow" style={{width: '20px', height: '20px'}} />
                      <div>
                        <p className="text-xs text-gray-300">09:00</p>
                        <p className="text-sm font-medium">{item.description}</p>
                      </div>
                    </div>
                    <span className="text-lg font-medium">{item.temperature}°</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </aside>

      </div>

      {/* MOBILE VERSION */}
      <div className="lg:hidden w-full px-5 py-6 flex flex-col gap-8 relative z-10">
        <div className="flex items-center justify-between gap-3">
          <img src={logoIcon} alt="Weather Logo" className="w-20 h-auto" />
          
          <form onSubmit={handleSearch} className="relative flex-1 max-w-[200px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent border-b border-white/50 py-1.5 pr-8 text-xs text-white focus:outline-none focus:border-white placeholder-gray-300 rounded-none"
            />
            <button type="submit" className="absolute right-0 top-1.5 cursor-pointer">
              <img src={searchIcon} alt="Search" className="w-4 h-4 brightness-0 invert opacity-90" />
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
          {weatherData.cities.map((city) => {
            const isSelected = selectedCity.id === city.id;
            return (
              <motion.button
                key={city.id}
                onClick={() => handleCitySelect(city)}
                animate={isSelected ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer border whitespace-nowrap ${
                  isSelected 
                    ? 'bg-white text-black font-semibold border-white shadow-md' 
                    : 'bg-white/10 hover:bg-white/25 text-white border-white/20'
                }`}
              >
                {city.name}
              </motion.button>
            );
          })}
        </div>

        <motion.div 
          key={selectedCity.name + (selectedDay ? selectedDay.date : '') + 'm'}
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center text-center bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-lg"
        >
          <motion.img 
            animate={{ y: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            src={cloudyIcon} 
            alt="Cloudy" 
            className="w-16 h-16 mb-2" 
          />
          <h1 className="text-6xl font-light text-white tracking-tight">
            {selectedDay ? selectedDay.temperature : selectedCity.current.temperature}°
          </h1>
          <h2 className="text-2xl font-roboto mt-1">{selectedCity.name}</h2>
          <p className="text-xs text-gray-300 mt-0.5">
            {selectedDay ? `${selectedDay.day} - ${selectedDay.date}` : "06:09 - Monday, 9 Sep '23"}
          </p>
        </motion.div>

        <div 
          className="rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col gap-6 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgBlur})`, backdropFilter: 'blur(13px)' }}
        >
          <div className="flex flex-wrap gap-1.5 justify-center">
            {sortedForecast.map((item, index) => {
              const isDaySelected = selectedDay?.date === item.date;
              return (
                <motion.button
                  key={index}
                  onClick={() => setSelectedDay(item)}
                  animate={isDaySelected ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer border ${
                    isDaySelected 
                      ? 'bg-white text-black font-semibold border-white' 
                      : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                  }`}
                >
                  {item.day}
                </motion.button>
              );
            })}
          </div>

          <motion.div
            key={selectedDay?.date || 'details-m'}
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.p variants={itemVariants} className="text-xs text-gray-300 mb-2">Weather Details:</motion.p>
            <motion.h3 variants={itemVariants} className="text-xs font-semibold tracking-wider text-white mb-4 uppercase">
              {selectedDay ? selectedDay.description : selectedCity.current.description}
            </motion.h3>
            
            <div className="space-y-3 text-sm">
              <motion.div variants={itemVariants} className="flex justify-between items-center border-b border-white/10 pb-2.5">
                <span className="text-gray-300 text-xs">Temp max</span>
                <div className="flex items-center gap-2 font-medium text-xs">
                  <span>{selectedDay ? selectedDay.tempMax : selectedCity.details.tempMax}°</span>
                  <img src={tempMaxIcon} alt="Temp max" className="w-4 h-4" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-between items-center border-b border-white/10 pb-2.5">
                <span className="text-gray-300 text-xs">Temp min</span>
                <div className="flex items-center gap-2 font-medium text-xs">
                  <span>{selectedDay ? selectedDay.tempMin : selectedCity.details.tempMin}°</span>
                  <img src={tempMinIcon} alt="Temp min" className="w-4 h-4"/>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-between items-center border-b border-white/10 pb-2.5">
                <span className="text-gray-300 text-xs">Humadity</span>
                <div className="flex items-center gap-2 font-medium text-xs">
                  <span>{selectedCity.details.humidity}%</span>
                  <img src={humidityIcon} alt="Humidity" className="w-4 h-4" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-between items-center border-b border-white/10 pb-2.5">
                <span className="text-gray-300 text-xs">Cloudy</span>
                <div className="flex items-center gap-2 font-medium text-xs">
                  <span>{selectedCity.details.cloudiness}%</span>
                  <img src={cloudyIcon} alt="Cloudy" className="w-4 h-4"/>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-between items-center pb-1">
                <span className="text-gray-300 text-xs">Wind</span>
                <div className="flex items-center gap-2 font-medium text-xs">
                  <span>{selectedCity.details.wind}km/h</span>
                  <img src={windIcon} alt="Wind" className="w-4 h-4"/>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <hr className="border-white/10 my-2" />

          <div>
            <p className="text-xs text-gray-300 mb-3">Today's Weather Forecast:</p>
            <div className="space-y-3">
              {sortedForecast.slice(0, 3).map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <img src={snowIcon} alt="Snow" className="w-4 h-4" />
                    <div>
                      <p className="text-[10px] text-gray-300">09:00</p>
                      <p className="text-xs font-medium">{item.description}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{item.temperature}°</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}