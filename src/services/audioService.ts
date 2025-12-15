class AudioService {
  private sounds: { [key: string]: HTMLAudioElement } = {};

  constructor() {
    this.loadSounds();
  }

  private loadSounds() {
    const soundFiles = {
      throw: '/sounds/throw.mp3',
      shake: '/sounds/shake.mp3',
      success: '/sounds/success.mp3',
      fail: '/sounds/fail.mp3',
      shiny: '/sounds/shiny.mp3'
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      this.sounds[key] = new Audio(path);
      this.sounds[key].preload = 'auto';
    });
  }

  playThrow() {
    this.play('throw');
  }

  playShake() {
    this.play('shake');
  }

  playSuccess() {
    this.play('success');
  }

  playFail() {
    this.play('fail');
  }

  playShinySound() {
    this.play('shiny');
  }

  private play(soundKey: string) {
    const sound = this.sounds[soundKey];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(err => console.log('Audio play failed:', err));
    }
  }
}

export const audioService = new AudioService();
