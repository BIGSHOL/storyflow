import React, { useState, useRef, useEffect } from 'react';
import { AudioTrack, AudioSettings } from '../../types';
import Play from 'lucide-react/dist/esm/icons/play';
import Pause from 'lucide-react/dist/esm/icons/pause';
import SkipForward from 'lucide-react/dist/esm/icons/skip-forward';
import SkipBack from 'lucide-react/dist/esm/icons/skip-back';
import Volume2 from 'lucide-react/dist/esm/icons/volume-2';
import VolumeX from 'lucide-react/dist/esm/icons/volume-x';
import Repeat from 'lucide-react/dist/esm/icons/repeat';

interface AudioLayoutProps {
  title?: string;
  description?: string;
  tracks: AudioTrack[];
  settings: AudioSettings;
  backgroundColor?: string;
  textColor?: string;
}

const AudioLayout: React.FC<AudioLayoutProps> = ({
  title,
  description,
  tracks,
  settings,
  backgroundColor = '#111111',
  textColor = '#ffffff',
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(settings.volume / 100);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  // 오디오 로드 시
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // 자동 재생
  useEffect(() => {
    if (settings.autoPlay && audioRef.current && currentTrack?.url) {
      audioRef.current.play().catch(e => console.log('Auto-play prevented:', e));
      setIsPlaying(true);
    }
  }, [settings.autoPlay, currentTrack?.url]);

  // 재생/일시정지
  const togglePlay = () => {
    if (!audioRef.current || !currentTrack?.url) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 다음 트랙
  const playNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setIsPlaying(true);
    } else if (settings.loop) {
      setCurrentTrackIndex(0);
      setIsPlaying(true);
    }
  };

  // 이전 트랙
  const playPrevious = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
      setIsPlaying(true);
    }
  };

  // 트랙 선택
  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  // 시간 업데이트
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // 메타데이터 로드 (duration 가져오기)
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // 트랙 종료
  const handleEnded = () => {
    if (settings.loop && currentTrackIndex === tracks.length - 1) {
      setCurrentTrackIndex(0);
      setIsPlaying(true);
    } else if (currentTrackIndex < tracks.length - 1) {
      playNext();
    } else {
      setIsPlaying(false);
    }
  };

  // 시간 포맷 (초 -> MM:SS)
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 진행바 클릭
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audioRef.current.currentTime = percentage * duration;
  };

  // 볼륨 토글
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // 트랙이 없을 때
  if (!tracks || tracks.length === 0) {
    return (
      <section
        className="min-h-screen flex items-center justify-center py-16 px-8"
        style={{ backgroundColor, color: textColor }}
      >
        <div className="text-center">
          <p className="text-gray-500">오디오 트랙이 없습니다</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="min-h-screen flex items-center justify-center py-16 px-8"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="max-w-4xl w-full">
        {/* 제목 및 설명 */}
        {(title || description) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>}
            {description && <p className="text-lg md:text-xl opacity-80">{description}</p>}
          </div>
        )}

        {/* 플레이어 */}
        <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700">
          {/* 앨범 커버 */}
          {currentTrack.coverImage && (
            <div className="mb-6 flex justify-center">
              <img
                src={currentTrack.coverImage}
                alt={currentTrack.title}
                className="w-64 h-64 object-cover rounded-xl shadow-2xl"
              />
            </div>
          )}

          {/* 현재 트랙 정보 */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-1">{currentTrack.title}</h3>
            {currentTrack.artist && (
              <p className="text-lg opacity-70">{currentTrack.artist}</p>
            )}
          </div>

          {/* 진행바 */}
          <div className="mb-6">
            <div
              className="h-2 bg-gray-700 rounded-full cursor-pointer hover:h-3 transition-all"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-indigo-500 rounded-full relative"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm opacity-60">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* 컨트롤 */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <button
              onClick={playPrevious}
              disabled={currentTrackIndex === 0 && !settings.loop}
              className="p-3 hover:bg-gray-700 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SkipBack size={24} />
            </button>

            <button
              onClick={togglePlay}
              className="p-4 bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>

            <button
              onClick={playNext}
              disabled={currentTrackIndex === tracks.length - 1 && !settings.loop}
              className="p-3 hover:bg-gray-700 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SkipForward size={24} />
            </button>
          </div>

          {/* 볼륨 & 반복 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={toggleMute} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value);
                  setVolume(newVolume);
                  if (audioRef.current) {
                    audioRef.current.volume = newVolume;
                  }
                  if (newVolume > 0 && isMuted) {
                    setIsMuted(false);
                    if (audioRef.current) audioRef.current.muted = false;
                  }
                }}
                className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {settings.loop && (
              <div className="flex items-center gap-2 text-sm opacity-70">
                <Repeat size={16} />
                <span>반복</span>
              </div>
            )}
          </div>
        </div>

        {/* 플레이리스트 */}
        {settings.showPlaylist && tracks.length > 1 && (
          <div className="mt-6 bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <h4 className="text-sm font-medium mb-3 opacity-70">플레이리스트</h4>
            <div className="space-y-2">
              {tracks.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => selectTrack(index)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    index === currentTrackIndex
                      ? 'bg-indigo-600/20 border border-indigo-500/50'
                      : 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{track.title}</p>
                      {track.artist && <p className="text-xs opacity-60 mt-0.5">{track.artist}</p>}
                    </div>
                    {track.duration && <span className="text-xs opacity-50">{track.duration}</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={currentTrack?.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          loop={false} // 수동으로 루프 처리
        />
      </div>
    </section>
  );
};

export default AudioLayout;
