/**
 * sfxr.js, a JavaScript port of Sfxr - http://www.drpetter.se
 *
 * Original C++ Version - Copyright (c) 2007 Tomas Pettersson
 * ActionScript Port    - Copyright (c) 2009 Thomas Vian
 * JavaScript Port      - Copyright (c) 2010 David Humphrey, Yury Delendik
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {
  var undef; // intentionally left undefined
  var Float32Array = this.Float32Array || Array;

  var sfxr = this.sfxr = (function() {
    /**
     * Resets the parameters, used at the start of each generate function
     */
    var resetParams = function (synth) {
      synth.waveType = 0;
      synth.startFrequency = 0.3;
      synth.minFrequency = 0.0;
      synth.slide = 0.0;
      synth.deltaSlide = 0.0;
      synth.squareDuty = 0.0;
      synth.dutySweep = 0.0;

      synth.vibratoDepth = 0.0;
      synth.vibratoSpeed = 0.0;

      synth.attackTime = 0.0;
      synth.sustainTime = 0.3;
      synth.decayTime = 0.4;
      synth.sustainPunch = 0.0;

      synth.lpFilterResonance = 0.0;
      synth.lpFilterCutoff = 1.0;
      synth.lpFilterCutoffSweep = 0.0;
      synth.hpFilterCutoff = 0.0;
      synth.hpFilterCutoffSweep = 0.0;

      synth.phaserOffset = 0.0;
      synth.phaserSweep = 0.0;

      synth.repeatSpeed = 0.0;

      synth.changeSpeed = 0.0;
      synth.changeAmount = 0.0;
    };

    return {
      /**
       * Sets the parameters to generate a pickup/coin sound
       */
      generatePickupCoin: function (synth) {
        synth.deleteCache();
        resetParams(synth);

        synth.startFrequency = 0.4 + Math.random() * 0.5;

        synth.sustainTime = Math.random() * 0.1;
        synth.decayTime = 0.1 + Math.random() * 0.4;
        synth.sustainPunch = 0.3 + Math.random() * 0.3;

        if (Math.random() < 0.5) {
          synth.changeSpeed = 0.5 + Math.random() * 0.2;
          synth.changeAmount = 0.2 + Math.random() * 0.4;
        }
      },

      /**
       * Sets the parameters to generate a laser/shoot sound
       */
      generateLaserShoot: function (synth) {
        synth.deleteCache();
        resetParams(synth);

        synth.waveType = Math.floor(Math.random() * 3);
        if (synth.waveType == 2 && Math.random() < 0.5) {
          synth.waveType = Math.floor(Math.random() * 2);
        }

        synth.startFrequency = 0.5 + Math.random() * 0.5;
        synth.minFrequency = synth.startFrequency - 0.2 - Math.random() * 0.6;
        if (synth.minFrequency < 0.2) {
          synth.minFrequency = 0.2;
        }

        synth.slide = -0.15 - Math.random() * 0.2;

        if (Math.random() < 0.33) {
          synth.startFrequency = 0.3 + Math.random() * 0.6;
          synth.minFrequency = Math.random() * 0.1;
          synth.slide = -0.35 - Math.random() * 0.3;
        }

        if (Math.random() < 0.5) {
          synth.squareDuty = Math.random() * 0.5;
          synth.dutySweep = Math.random() * 0.2;
        }
        else {
          synth.squareDuty = 0.4 + Math.random() * 0.5;
          synth.dutySweep = -Math.random() * 0.7;
        }

        synth.sustainTime = 0.1 + Math.random() * 0.2;
        synth.decayTime = Math.random() * 0.4;
        if (Math.random() < 0.5) synth.sustainPunch = Math.random() * 0.3;

        if (Math.random() < 0.33) {
          synth.phaserOffset = Math.random() * 0.2;
          synth.phaserSweep = -Math.random() * 0.2;
        }

        if (Math.random() < 0.5) synth.hpFilterCutoff = Math.random() * 0.3;
      },

      /**
       * Sets the parameters to generate an explosion sound
       */
      generateExplosion: function (synth) {
        synth.deleteCache();
        resetParams(synth);
        synth.waveType = 3;

        if (Math.random() < 0.5) {
          synth.startFrequency = 0.1 + Math.random() * 0.4;
          synth.slide = -0.1 + Math.random() * 0.4;
        }
        else {
          synth.startFrequency = 0.2 + Math.random() * 0.7;
          synth.slide = -0.2 - Math.random() * 0.2;
        }

        synth.startFrequency *= synth.startFrequency;

        if (Math.random() < 0.2) synth.slide = 0.0;
        if (Math.random() < 0.33) synth.repeatSpeed = 0.3 + Math.random() * 0.5;

        synth.sustainTime = 0.1 + Math.random() * 0.3;
        synth.decayTime = Math.random() * 0.5;
        synth.sustainPunch = 0.2 + Math.random() * 0.6;

        if (Math.random() < 0.5) {
          synth.phaserOffset = -0.3 + Math.random() * 0.9;
          synth.phaserSweep = -Math.random() * 0.3;
        }

        if (Math.random() < 0.33) {
          synth.changeSpeed = 0.6 + Math.random() * 0.3;
          synth.changeAmount = 0.8 - Math.random() * 1.6;
        }
      },

      /**
       * Sets the parameters to generate a powerup sound
       */
      generatePowerup: function (synth) {
        synth.deleteCache();
        resetParams(synth);

        if (Math.random() < 0.5) synth.waveType = 1;
        else synth.squareDuty = Math.random() * 0.6;

        if (Math.random() < 0.5) {
          synth.startFrequency = 0.2 + Math.random() * 0.3;
          synth.slide = 0.1 + Math.random() * 0.4;
          synth.repeatSpeed = 0.4 + Math.random() * 0.4;
        }
        else {
          synth.startFrequency = 0.2 + Math.random() * 0.3;
          synth.slide = 0.05 + Math.random() * 0.2;

          if (Math.random() < 0.5) {
            synth.vibratoDepth = Math.random() * 0.7;
            synth.vibratoSpeed = Math.random() * 0.6;
          }
        }

        synth.sustainTime = Math.random() * 0.4;
        synth.decayTime = 0.1 + Math.random() * 0.4;
      },

      /**
       * Sets the parameters to generate a hit/hurt sound
       */
      generateHitHurt: function (synth) {
        synth.deleteCache();
        resetParams(synth);
        synth.waveType = Math.floor(Math.random() * 3);
        if (synth.waveType == 2) synth.waveType = 3;
        else if (synth.waveType == 0) synth.squareDuty = Math.random() * 0.6;

        synth.startFrequency = 0.2 + Math.random() * 0.6;
        synth.slide = -0.3 - Math.random() * 0.4;

        synth.sustainTime = Math.random() * 0.1;
        synth.decayTime = 0.1 + Math.random() * 0.2;

        if (Math.random() < 0.5) synth.hpFilterCutoff = Math.random() * 0.3;
      },

      /**
       * Sets the parameters to generate a jump sound
       */
      generateJump: function (synth) {
        synth.deleteCache();
        resetParams(synth);

        synth.waveType = 0;
        synth.squareDuty = Math.random() * 0.6;
        synth.startFrequency = 0.3 + Math.random() * 0.3;
        synth.slide = 0.1 + Math.random() * 0.2;

        synth.sustainTime = 0.1 + Math.random() * 0.3;
        synth.decayTime = 0.1 + Math.random() * 0.2;

        if (Math.random() < 0.5) synth.hpFilterCutoff = Math.random() * 0.3;
        if (Math.random() < 0.5) synth.lpFilterCutoff = 1.0 - Math.random() * 0.6;
      },

      /**
       * Sets the parameters to generate a blip/select sound
       */
      generateBlipSelect: function (synth) {
        synth.deleteCache();
        resetParams(synth);

        synth.waveType = Math.floor(Math.random() * 2);
        if (synth.waveType == 0) synth.squareDuty = Math.random() * 0.6;

        synth.startFrequency = 0.2 + Math.random() * 0.4;

        synth.sustainTime = 0.1 + Math.random() * 0.1;
        synth.decayTime = Math.random() * 0.2;
        synth.hpFilterCutoff = 0.1;
      },

      /**
       * Randomly adjusts the parameters ever so slightly
       */
      mutate: function (synth, mutation) {
        mutation = mutation || 0.05;
        synth.deleteCache();
        if (Math.random() < 0.5) synth.startFrequency += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.minFrequency += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.slide += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.deltaSlide += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.squareDuty += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.dutySweep += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.vibratoDepth += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.vibratoSpeed += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.attackTime += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.sustainTime += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.decayTime += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.sustainPunch += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.lpFilterCutoff += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.lpFilterCutoffSweep += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.lpFilterResonance += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.hpFilterCutoff += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.hpFilterCutoffSweep += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.phaserOffset += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.phaserSweep += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.repeatSpeed += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.changeSpeed += Math.random() * mutation * 2 - mutation;
        if (Math.random() < 0.5) synth.changeAmount += Math.random() * mutation * 2 - mutation;

        synth.validate();
      },

      /**
       * Sets all parameters to random values
       */
      randomize: function (synth) {
        synth.deleteCache();
        synth.waveType = Math.floor(Math.random() * 4);

        synth.attackTime = Math.pow(Math.random() * 2 - 1, 4);
        synth.sustainTime = Math.pow(Math.random() * 2 - 1, 2);
        synth.sustainPunch = Math.pow(Math.random() * 0.8, 2);
        synth.decayTime = Math.random();

        synth.startFrequency = (Math.random() < 0.5) ? Math.pow(Math.random() * 2 - 1, 2) : (Math.pow(Math.random() * 0.5, 3) + 0.5);
        synth.minFrequency = 0.0;

        synth.slide = Math.pow(Math.random() * 2 - 1, 5);
        synth.deltaSlide = Math.pow(Math.random() * 2 - 1, 3);

        synth.vibratoDepth = Math.pow(Math.random() * 2 - 1, 3);
        synth.vibratoSpeed = Math.random() * 2 - 1;

        synth.changeAmount = Math.random() * 2 - 1;
        synth.changeSpeed = Math.random() * 2 - 1;

        synth.squareDuty = Math.random() * 2 - 1;
        synth.dutySweep = Math.pow(Math.random() * 2 - 1, 3);

        synth.repeatSpeed = Math.random() * 2 - 1;

        synth.phaserOffset = Math.pow(Math.random() * 2 - 1, 3);
        synth.phaserSweep = Math.pow(Math.random() * 2 - 1, 3);

        synth.lpFilterCutoff = 1 - Math.pow(Math.random(), 3);
        synth.lpFilterCutoffSweep = Math.pow(Math.random() * 2 - 1, 3);
        synth.lpFilterResonance = Math.random() * 2 - 1;

        synth.hpFilterCutoff = Math.pow(Math.random(), 5);
        synth.hpFilterCutoffSweep = Math.pow(Math.random() * 2 - 1, 5);

        if (synth.attackTime + synth.sustainTime + synth.decayTime < 0.2) {
          synth.sustainTime = 0.2 + Math.random() * 0.3;
          synth.decayTime = 0.2 + Math.random() * 0.3;
        }

        if ((synth.startFrequency > 0.7 && synth.slide > 0.2) || (synth.startFrequency < 0.2 && synth.slide < -0.05)) {
          synth.slide = -synth.slide;
        }

        if (synth.lpFilterCutoff < 0.1 && synth.lpFilterCutoffSweep < -0.05) {
          synth.lpFilterCutoffSweep = -synth.lpFilterCutoffSweep;
        }
      }
    };
  })();

  sfxr.Synth = function () {
    this.waveType = 0; // Shape of the wave (0:square, 1:saw, 2:sin or 3:noise)
    this.sampleRate = 44100; // Samples per second - only used for .wav export
    this.bitDepth = 16; // Bits per sample - only used for .wav export
    this.masterVolume = 0.5; // Overall volume of the sound (0 to 1)
    this.attackTime = 0.0; // Length of the volume envelope attack (0 to 1)
    this.sustainTime = 0.0; // Length of the volume envelope sustain (0 to 1)
    this.sustainPunch = 0.0; // Tilts the sustain envelope for more 'pop' (0 to 1)
    this.decayTime = 0.0; // Length of the volume envelope decay (yes, I know it's called release) (0 to 1)
    this.startFrequency = 0.0; // Base note of the sound (0 to 1)
    this.minFrequency = 0.0; // If sliding, the sound will stop at this frequency, to prevent really low notes (0 to 1)
    this.slide = 0.0; // Slides the note up or down (-1 to 1)
    this.deltaSlide = 0.0; // Accelerates the slide (-1 to 1)
    this.vibratoDepth = 0.0; // Strength of the vibrato effect (0 to 1)
    this.vibratoSpeed = 0.0; // Speed of the vibrato effect (i.e. frequency) (0 to 1)
    this.changeAmount = 0.0; // Shift in note, either up or down (-1 to 1)
    this.changeSpeed = 0.0; // How fast the note shift happens (only happens once) (0 to 1)
    this.squareDuty = 0.0; // Controls the ratio between the up and down states of the square wave, changing the tibre (0 to 1)
    this.dutySweep = 0.0; // Sweeps the duty up or down (-1 to 1)
    this.repeatSpeed = 0.0; // Speed of the note repeating - certain variables are reset each time (0 to 1)
    this.phaserOffset = 0.0; // Offsets a second copy of the wave by a small phase, changing the tibre (-1 to 1)
    this.phaserSweep = 0.0; // Sweeps the phase up or down (-1 to 1)
    this.lpFilterCutoff = 0.0; // Frequency at which the low-pass filter starts attenuating higher frequencies (0 to 1)
    this.lpFilterCutoffSweep = 0.0; // Sweeps the low-pass cutoff up or down (-1 to 1)
    this.lpFilterResonance = 0.0; // Changes the attenuation rate for the low-pass filter, changing the timbre (0 to 1)
    this.hpFilterCutoff = 0.0; // Frequency at which the high-pass filter starts attenuating lower frequencies (0 to 1)
    this.hpFilterCutoffSweep = 0.0; // Sweeps the high-pass cutoff up or down (-1 to 1)

    var _cachedWave; // Cached wave data from a cacheSound() call
    var _cachedMutations = []; // Cached mutated wave data from a cacheMutations() call
    var _cachedMutationsNum = 0; // Number of cached mutations
//    var _waveData; //:ByteArray;					// Full wave, read out in chuncks by the onSampleData method
//    var _waveDataPos; //:uint;						// Current position in the waveData
//    var _waveDataLength; //:uint;					// Number of bytes in the waveData
//    var _waveDataBytes; //:uint;					// Number of bytes to write to the soundcard
    var _original; //:SfxrSynth;					// Copied properties for mutationBase

    var _envelopeVolume = 0.0; // Current volume of the envelope
    var _envelopeStage = 0; // Current stage of the envelope (attack, sustain, decay, end)
    var _envelopeTime = 0.0; // Current time through current enelope stage
    var _envelopeLength = 0.0; // Length of the current envelope stage
    var _envelopeLength0 = 0.0; // Length of the attack stage
    var _envelopeLength1 = 0.0; // Length of the sustain stage
    var _envelopeLength2 = 0.0; // Length of the decay stage
    var _envelopeOverLength0 = 0.0; // 1 / _envelopeLength0 (for quick calculations)
    var _envelopeOverLength1 = 0.0; // 1 / _envelopeLength1 (for quick calculations)
    var _envelopeOverLength2 = 0.0; // 1 / _envelopeLength2 (for quick calculations)
    var _envelopeFullLength = 0; // Full length of the volume envelop (and therefore sound)
    var _phase = 0.0; // Phase through the wave
    var _pos = 0.0; // Phase expresed as a Number from 0-1
    var _period = 0.0; // Period of the wave
    var _periodTemp = 0.0; // Period modified by vibrato
    var _maxPeriod = 0.0; // Maximum period before sound stops (from minFrequency)
    var _slide = 0.0; // Note slide
    var _deltaSlide = 0.0; // Change in slide
    var _vibratoPhase = 0.0; // Phase through the vibrato sine wave
    var _vibratoSpeed = 0.0; // Speed at which the vibrato phase moves
    var _vibratoAmplitude = 0.0; // Amount to change the period of the wave by at the peak of the vibrato wave
    var _changeAmount = 0.0; // Amount to change the note by
    var _changeTime = 0; // Counter for the note change
    var _changeLimit = 0; // Once the time reaches this limit, the note changes
    var _squareDuty = 0.0; // Offset of center switching point in the square wave
    var _dutySweep = 0.0; // Amount to change the duty by
    var _repeatTime = 0; // Counter for the repeats
    var _repeatLimit = 0; // Once the time reaches this limit, some of the variables are reset
    var _phaserOffset = 0.0; // Phase offset for phaser effect
    var _phaserDeltaOffset= 0.0; // Change in phase offset
    var _phaserInt = 0; // Integer phaser offset, for bit maths
    var _phaserPos = 0; // Position through the phaser buffer
    var _phaserBuffer = []; // Buffer of wave values used to create the out of phase second wave
    var _lpFilterPos = 0.0; // Confession time
    var _lpFilterOldPos = 0.0; 	// I can't quite get a handle on how the filters work
    var _lpFilterDeltaPos = 0.0; // And the variables in the original source had short, meaningless names
    var _lpFilterCutoff = 0.0; // Perhaps someone would be kind enough to enlighten me
    var _lpFilterDeltaCutoff = 0.0; // I keep going back and staring at the code
    var _lpFilterDamping = 0.0; // But nothing comes to mind
    var _hpFilterPos = 0.0; // Oh well, it works
    var _hpFilterCutoff = 0.0; // And I guess that's all that matters
    var _hpFilterDeltaCutoff = 0.0; // Annoying though
    var _noiseBuffer = []; // Buffer of random values used to generate noise
    var _superSample = 0.0; // Actual sample writen to the wave
    var _sample = 0.0; // Sub-sample calculated 8 times per actual sample, averaged out to get the super sample
    var _sampleCount = 0; // Number of samples added to the buffer sample
    var _bufferSample = 0.0; // Another supersample used to create a 22050Hz wave

    var self = this; // Reference to instance.
    this.audioBuffer; // Reference to current audioBuffer

    /**
     * Plays the sound, synthesizing the sound as it plays
     */
    this.play = function () {
      reset(true);

      var length = _envelopeFullLength ? Math.floor(_envelopeFullLength) : 3072;
      this.audioBuffer = new Float32Array(length);
      synthWave(this.audioBuffer, this.audioBuffer.length, true);

      window.AudioContext = window.AudioContext || window.webkitAudioContext;

      var context = new AudioContext({ sampleRate: this.sampleRate });

      var buffer = context.createBuffer(1, this.audioBuffer.length, this.sampleRate);
      buffer.copyToChannel(this.audioBuffer, 0);

      var source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start();
    };
    var play = this.play;

    this.updateBuffer = function() {
      reset(true);

      var length = _envelopeFullLength ? Math.floor(_envelopeFullLength) : 3072;
      this.audioBuffer = new Float32Array(length);
      synthWave(this.audioBuffer, this.audioBuffer.length, true);
      return this.audioBuffer;
    };

    /**
     * Plays a mutation of the sound, synthesizing the sound as it plays
     * @param	mutation	Amount of mutation
     */
    this.playMutated = function (mutation) {
      mutation = mutation || 0.5;

      _original = clone();
      SfxrGenerator.mutate(this, mutation);

      play();
    };
    var playMutated = this.playMutated;

// TODO...not sure if I care about this, but maybe add all this.

//    /**
//     * Plays the waveData of the wave, using the FP10 Sound API
//     */
//    this.playCached = function () {
//      if (!_cachedWave) cacheSound();
//
//     _waveData = _cachedWave;
//
//      playWaveData();
//    };
//    var playCached = this.playCached;

//    /**
//     * Plays a slightly modified version of the sound, without changing the original data
//     * @param	mutations	Number of mutations to cache
//     * @param	mutation	Amount of mutation
//     */
//    this.playCachedMutation = function (mutations, mutation) {
//      mutations = mutations || 20;
//      mutation = mutation || 0.5;
//
//      if (!_cachedMutations) cacheMutations(mutations, mutation);
//
//      _waveData = _cachedMutations[Math.random() * _cachedMutationsNum];
//
//      playWaveData();
//    };
//    var playCachedMutation = this.playCachedMutation;

//    /**
//     * Plays the curent wave data
//     */
//    var playWaveData = function () {
//      _waveDataLength = _waveData.length;
//      _waveData.position = 0;
//     _waveDataPos = 0;
//      _waveDataBytes = 24576;
//
//      if (!_sound) {
//        _sound = new Sound();
//        _sound.addEventListener(SampleDataEvent.SAMPLE_DATA, onSampleDataCached);
//      }
//
//      _channel = _sound.play();
//    };

//    /**
//     * Reads out chuncks of data from the waveData wave and writes it to the soundcard
//     * @param	e	SampleDataEvent to write data to
//     */
//    var onSampleDataCached = function (e) {
//      if (_waveDataPos + _waveDataBytes > _waveDataLength) _waveDataBytes = _waveDataLength - _waveDataPos;
//
//      if (_waveDataBytes > 0) e.data.writeBytes(_waveData, _waveDataPos, _waveDataBytes);
//
//      _waveDataPos += _waveDataBytes;
//    };

//    /**
//     * Synthesize the playable sound
//     */
//    this.cacheSound = function () {
//      validate();
//      reset(true);
//
//      _cachedWave = new ByteArray();
//      synthWave(_cachedWave, _envelopeFullLength, true);
//
//      var length = _cachedWave.length;
//
//      if (length < 24576) {
//        // If the sound is smaller than the buffer length, add silence to allow it to play
//        _cachedWave.position = length;
//        for (var i = 0, l = 24576 - length; i < l; i++) _cachedWave.writeFloat(0.0);
//      }
//    };
//    var cacheSound = this.cacheSound;

//    /**
//     * Caches a series of mutations on the source sound
//     * @param	mutations	Number of mutations to cache
//     * @param	mutation	Amount of mutation
//     */
//    this.cacheMutations = function (mutations, mutation) {
//      mutation = mutation || 0.05;
//
//      _cachedMutationsNum = mutations;
//      var cachedMutations = []; //:Vector.<ByteArray> = new Vector.<ByteArray>(mutations, true);
//      var original = clone();
//
//      for (var i = 0; i < _cachedMutationsNum; i++) {
//        SfxrGenerator.mutate(this, mutation);
//        cacheSound();
//       cachedMutations.push(_cachedWave);
//        copyFrom(original, false);
//      }
//
//      _cachedMutations = cachedMutations;
//    };
//    var cacheMutations = this.cacheMutations;

//    /**
//     * Deletes the current wave data, forcing it to be synthesized again on the next play
//     */
    this.deleteCache = function () {
//      _cachedWave = null;
//      _cachedMutations = null;
    };
    var deleteCache = this.deleteCache;

    /**
     * Makes sure all settings values are within the correct range
     */
    this.validate = function () {
      if (this.waveType > 3) this.waveType = 0;
      if (this.sampleRate != 22050) this.sampleRate = 44100;
      if (this.bitDepth != 8) this.bitDepth = 16;

      this.masterVolume = clamp1(this.masterVolume);
      this.attackTime = clamp1(this.attackTime);
      this.sustainTime = clamp1(this.sustainTime);
      this.sustainPunch = clamp1(this.sustainPunch);
      this.decayTime = clamp1(this.decayTime);
      this.startFrequency = clamp1(this.startFrequency);
      this.minFrequency = clamp1(this.minFrequency);
      this.slide = clamp2(this.slide);
      this.deltaSlide = clamp2(this.deltaSlide);
      this.vibratoDepth = clamp1(this.vibratoDepth);
      this.vibratoSpeed = clamp1(this.vibratoSpeed);
      this.changeAmount = clamp2(this.changeAmount);
      this.changeSpeed = clamp1(this.changeSpeed);
      this.squareDuty = clamp1(this.squareDuty);
      this.dutySweep = clamp2(this.dutySweep);
      this.repeatSpeed = clamp1(this.repeatSpeed);
      this.phaserOffset = clamp2(this.phaserOffset);
      this.phaserSweep = clamp2(this.phaserSweep);
      this.lpFilterCutoff = clamp1(this.lpFilterCutoff);
      this.lpFilterCutoffSweep = clamp2(this.lpFilterCutoffSweep);
      this.lpFilterResonance = clamp1(this.lpFilterResonance);
      this.hpFilterCutoff = clamp1(this.hpFilterCutoff);
      this.hpFilterCutoffSweep = clamp2(this.hpFilterCutoffSweep);
    };
    var validate = this.validate;

    /**
     * Clams a value to betwen 0 and 1
     * @param	value	Input value
     * @return			The value clamped between 0 and 1
     */
    var clamp1 = function (value) {
      return (value > 1.0) ? 1.0 : ((value < 0.0) ? 0.0 : value);
    };

    /**
     * Clams a value to betwen -1 and 1
     * @param	value	Input value
     * @return			The value clamped between -1 and 1
     */
    var clamp2 = function (value) {
      return (value > 1.0) ? 1.0 : ((value < -1.0) ? -1.0 : value);
    };

    /**
     * Resets the runing variables
     * Used once at the start (total reset) and for the repeat effect (partial reset)
     * @param	totalReset	If the reset is total
     */
    var reset = function (totalReset) {
      _period = 100.0 / (self.startFrequency * self.startFrequency + 0.001);
      _maxPeriod = 100.0 / (self.minFrequency * self.minFrequency + 0.001);

      _slide = 1.0 - self.slide * self.slide * self.slide * 0.01;
      _deltaSlide = -self.deltaSlide * self.deltaSlide * self.deltaSlide * 0.000001;

      _squareDuty = 0.5 - self.squareDuty * 0.5;
      _dutySweep = -self.dutySweep * 0.00005;

      if (self.changeAmount > 0.0) _changeAmount = 1.0 - self.changeAmount * self.changeAmount * 0.9;
      else _changeAmount = 1.0 + self.changeAmount * self.changeAmount * 10.0;

      _changeTime = 0;

      if (self.changeSpeed === 1.0) _changeLimit = 0;
      else _changeLimit = (1.0 - self.changeSpeed) * (1.0 - self.changeSpeed) * 20000 + 32;

      if (totalReset) {
        _phase = 0;

        _lpFilterPos = 0.0;
        _lpFilterDeltaPos = 0.0;
        _lpFilterCutoff = self.lpFilterCutoff * self.lpFilterCutoff * self.lpFilterCutoff * 0.1;
        _lpFilterDeltaCutoff = 1.0 + self.lpFilterCutoffSweep * 0.0001;
        _lpFilterDamping = 5.0 / (1.0 + self.lpFilterResonance * self.lpFilterResonance * 20.0) * (0.01 + _lpFilterCutoff)
        if (_lpFilterDamping > 0.8) _lpFilterDamping = 0.8;

        _hpFilterPos = 0.0;
        _hpFilterCutoff = self.hpFilterCutoff * self.hpFilterCutoff * 0.1;
        _hpFilterDeltaCutoff = 1.0 + self.hpFilterCutoffSweep * 0.0003;

        _vibratoPhase = 0.0;
        _vibratoSpeed = self.vibratoSpeed * self.vibratoSpeed * 0.01;
        _vibratoAmplitude = self.vibratoDepth * 0.5;

        _envelopeVolume = 0.0;
        _envelopeStage = 0;
        _envelopeTime = 0;
        _envelopeLength0 = self.attackTime * self.attackTime * 100000.0;
        _envelopeLength1 = self.sustainTime * self.sustainTime * 100000.0;
        _envelopeLength2 = self.decayTime * self.decayTime * 100000.0;
        _envelopeLength = _envelopeLength0;
        _envelopeFullLength = _envelopeLength0 + _envelopeLength1 + _envelopeLength2;

        _envelopeOverLength0 = 1.0 / _envelopeLength0;
        _envelopeOverLength1 = 1.0 / _envelopeLength1;
        _envelopeOverLength2 = 1.0 / _envelopeLength2;

        _phaserOffset = self.phaserOffset * self.phaserOffset * 1020.0;
        if (self.phaserOffset < 0.0) _phaserOffset = -_phaserOffset;
        _phaserDeltaOffset = self.phaserSweep * self.phaserSweep;
        if (_phaserDeltaOffset < 0.0) _phaserDeltaOffset = -_phaserDeltaOffset;
        _phaserPos = 0;

        if (!_phaserBuffer) _phaserBuffer = new Float32Array(1024);
        if (!_noiseBuffer) _noiseBuffer = new Float32Array(32);
        for (var i = 0; i < 1024; i++) _phaserBuffer[i] = 0.0;
        for (var i = 0; i < 32; i++) _noiseBuffer[i] = Math.random() * 2.0 - 1.0;

        _repeatTime = 0;

        if (self.repeatSpeed == 0.0) _repeatLimit = 0;
        else _repeatLimit = Math.floor((1.0 - self.repeatSpeed) * (1.0 - self.repeatSpeed) * 20000) + 32;
      }
    };

    /**
     * Writes the wave to the supplied buffer ByteArray
     * @param	buffer		A ByteArray to write the wave to
     * @param	waveData		If the wave should be written for the waveData
     */
    var synthWave = function (buffer, length, waveData) {
      waveData = !! waveData;
      var finished = false;

      _sampleCount = 0;
      _bufferSample = 0.0;

      for (var i = 0; i < length; i++) {
        if (finished) return;

        if (_repeatLimit != 0) {
          if (++_repeatTime >= _repeatLimit) {
            _repeatTime = 0;
            reset(false);
          }
        }

        if (_changeLimit != 0) {
          if (++_changeTime >= _changeLimit) {
            _changeLimit = 0;
            _period *= _changeAmount;
          }
        }

        _slide += _deltaSlide;
        _period = _period * _slide;

        if (_period > _maxPeriod) {
          _period = _maxPeriod;
          if (self.minFrequency > 0.0) finished = true;
        }

        _periodTemp = _period;

        if (_vibratoAmplitude > 0.0) {
          _vibratoPhase += _vibratoSpeed;
          _periodTemp = _period * (1.0 + Math.sin(_vibratoPhase) * _vibratoAmplitude);
        }

        _periodTemp = Math.floor(_periodTemp);
        if (_periodTemp < 8) _periodTemp = 8;

        _squareDuty += _dutySweep;
        if (_squareDuty < 0.0) _squareDuty = 0.0;
        else if (_squareDuty > 0.5) _squareDuty = 0.5;

        if (++_envelopeTime > _envelopeLength) {
          _envelopeTime = 0;

          switch (++_envelopeStage) {
          case 1:
            _envelopeLength = _envelopeLength1;
            break;
          case 2:
            _envelopeLength = _envelopeLength2;
            break;
          }
        }

        switch (_envelopeStage) {
        case 0:
          _envelopeVolume = _envelopeTime * _envelopeOverLength0;
          break;
        case 1:
          _envelopeVolume = 1.0 + (1.0 - _envelopeTime * _envelopeOverLength1) * 2.0 * self.sustainPunch;
          break;
        case 2:
          _envelopeVolume = 1.0 - _envelopeTime * _envelopeOverLength2;
          break;
        case 3:
          _envelopeVolume = 0.0;
          finished = true;
          break;
        }

        _phaserOffset += _phaserDeltaOffset;
        _phaserInt = Math.floor(_phaserOffset);
        if (_phaserInt < 0) _phaserInt = -_phaserInt;
        else if (_phaserInt > 1023) _phaserInt = 1023;

        if (_hpFilterDeltaCutoff != 0.0) {
          // what is this???  --> _hpFilterCutoff *- _hpFilterDeltaCutoff;
          _hpFilterCutoff *= _hpFilterDeltaCutoff;
          if (_hpFilterCutoff < 0.00001) _hpFilterCutoff = 0.00001;
          else if (_hpFilterCutoff > 0.1) _hpFilterCutoff = 0.1;
        }

        _superSample = 0.0;
        for (var j = 0; j < 8; j++) {
          _sample = 0.0;
          _phase++;
          if (_phase >= _periodTemp) {
            _phase = _phase % _periodTemp;
            if (self.waveType == 3) {
              for (var n = 0; n < 32; n++) _noiseBuffer[n] = Math.random() * 2.0 - 1.0;
            }
          }

          _pos = _phase / _periodTemp;

          switch (self.waveType) {
          case 0:
            _sample = (_pos < _squareDuty) ? 0.5 : -0.5;
            break;
          case 1:
            _sample = 1.0 - _pos * 2.0;
            break;
          case 2:
            _sample = Math.sin(_pos * Math.PI * 2.0);
            break;
          case 3:
            _sample = _noiseBuffer[Math.floor(_phase * 32 / Math.floor(_periodTemp))];
            break;
          }

          _lpFilterOldPos = _lpFilterPos;
          _lpFilterCutoff *= _lpFilterDeltaCutoff;
          if (_lpFilterCutoff < 0.0) _lpFilterCutoff = 0.0;
          else if (_lpFilterCutoff > 0.1) _lpFilterCutoff = 0.1;

          if (self.lpFilterCutoff != 1.0) {
            _lpFilterDeltaPos += (_sample - _lpFilterPos) * _lpFilterCutoff * 4;
            _lpFilterDeltaPos -= _lpFilterDeltaPos * _lpFilterDamping;
          }
          else {
            _lpFilterPos = _sample;
            _lpFilterDeltaPos = 0.0;
          }

          _lpFilterPos += _lpFilterDeltaPos;

          _hpFilterPos += _lpFilterPos - _lpFilterOldPos;
          _hpFilterPos -= _hpFilterPos * _lpFilterCutoff;
          _sample = _hpFilterPos;

          _phaserBuffer[_phaserPos & 1023] = _sample;
          _sample += _phaserBuffer[(_phaserPos - _phaserInt + 1024) & 1023];
          _phaserPos = (_phaserPos + 1) & 1023;

          _superSample += _sample;
        }

        _superSample = self.masterVolume * self.masterVolume * _envelopeVolume * _superSample / 8.0;

        if (_superSample > 1.0) _superSample = 1.0;
        if (_superSample < -1.0) _superSample = -1.0;

        if (waveData) {
          buffer[i] = _superSample;
          buffer[i + 1] = _superSample;
        }
        else {
          _bufferSample += _superSample;

          _sampleCount++;

          if (self.sampleRate == 44100 || _sampleCount == 2) {
            _bufferSample /= _sampleCount;
            _sampleCount = 0;

            if (self.bitDepth == 16) buffer[i] = Math.floor(32000.0 * _bufferSample);
            else buffer[i] = _bufferSample * 127 + 128;

            _bufferSample = 0.0;
          }
        }
      }
    };

    /**
     * Returns a string representation of the parameters for copy/paste sharing
     * @return	A comma-delimited list of parameter values
     */
		this.getSettingsString = function()
		{
      var string = '' + this.waveType;
      string += "," + to3DP(this.attackTime)          + "," + to3DP(this.sustainTime)
             +  "," + to3DP(this.sustainPunch)        + "," + to3DP(this.decayTime)
             +  "," + to3DP(this.startFrequency)      + "," + to3DP(this.minFrequency)
             +  "," + to3DP(this.slide)               + "," + to3DP(this.deltaSlide)
             +  "," + to3DP(this.vibratoDepth)        + "," + to3DP(this.vibratoSpeed)
             +  "," + to3DP(this.changeAmount)        + "," + to3DP(this.changeSpeed)
             +  "," + to3DP(this.squareDuty)          + "," + to3DP(this.dutySweep)
             +  "," + to3DP(this.repeatSpeed)         + "," + to3DP(this.phaserOffset)
             +  "," + to3DP(this.phaserSweep)         + "," + to3DP(this.lpFilterCutoff)
             +  "," + to3DP(this.lpFilterCutoffSweep) + "," + to3DP(this.lpFilterResonance)
             +  "," + to3DP(this.hpFilterCutoff)      + "," + to3DP(this.hpFilterCutoffSweep)
             +  "," + to3DP(this.masterVolume);
      return string;
		};
    var getSettingsString = this.getSettingsString;

    /**
     * Returns the number as a string to 3 decimal places
     * @param	value	Number to convert
     * @return			Number to 3dp as a string
     */
    var to3DP = function (value) {
      if (value < 0.001 && value > -0.001) return '';

      return value.toFixed(3) || 0;
    };

    /**
     * Parses a settings string into the parameters
     * @param	string	Settings string to parse
     * @return			If the string successfully parsed
     */
    this.setSettingsString = function (string) {
      deleteCache();
      var values = string.split(",");

      if (values.length != 24) return false;

      this.waveType = parseInt(values[0], 10) || 0;
      this.attackTime = parseFloat(values[1]) || 0;
      this.sustainTime = parseFloat(values[2]) || 0;
      this.sustainPunch = parseFloat(values[3]) || 0;
      this.decayTime = parseFloat(values[4]) || 0;
      this.startFrequency = parseFloat(values[5]) || 0;
      this.minFrequency = parseFloat(values[6]) || 0;
      this.slide = parseFloat(values[7]) || 0;
      this.deltaSlide = parseFloat(values[8]) || 0;
      this.vibratoDepth = parseFloat(values[9]) || 0;
      this.vibratoSpeed = parseFloat(values[10]) || 0;
      this.changeAmount = parseFloat(values[11]) || 0;
      this.changeSpeed = parseFloat(values[12]) || 0;
      this.squareDuty = parseFloat(values[13]) || 0;
      this.dutySweep = parseFloat(values[14]) || 0;
      this.repeatSpeed = parseFloat(values[15]) || 0;
      this.phaserOffset = parseFloat(values[16]) || 0;
      this.phaserSweep = parseFloat(values[17]) || 0;
      this.lpFilterCutoff = parseFloat(values[18]) || 0;
      this.lpFilterCutoffSweep = parseFloat(values[19]) || 0;
      this.lpFilterResonance = parseFloat(values[20]) || 0;
      this.hpFilterCutoff = parseFloat(values[21]) || 0;
      this.hpFilterCutoffSweep = parseFloat(values[22]) || 0;
      this.masterVolume = parseFloat(values[23]) || 0;

      validate();

      return true;
    };
    var setSettingsString = this.setSettingsString;

    var btoa = window.btoa || function(input) {
      // Base 64 encoding function, for browsers that do not support btoa()
      // by Tyler Akins (http://rumkin.com), available in the public domain
      var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;

      do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                 keyStr.charAt(enc3) + keyStr.charAt(enc4);
      } while (i < input.length);

      return output;
    };

    /**
     * Returns an array of the wave in the form of a .wav file, ready to be saved out
       * @returnWave in a .wav file
     */
    this.getWaveURI = function() {
      reset(true);

      function packUInt16(value) {
        var i0 = (value & 255), i1 = (value >> 8) & 255;
        return String.fromCharCode(i0, i1);
      }

      function packUInt32(value) {
        var i0 = (value & 255), i1 = (value >> 8) & 255, i2 = (value >> 16) & 255, i3 = (value >>> 24) & 255;
        return String.fromCharCode(i0, i1, i2, i3);
      }

      function packInt16Array(value) {
        var dataItems = [], dataItem = "";
        for (var i=0, length = value.length; i < length; ++i) {
          // Break long strings; better memory management (?)
          if (dataItem.length >= 1024) {
            dataItems.push(dataItem); dataItem = "";
          }
          dataItem += packUInt16(value[i] & 0xFFFF);
        }
        dataItems.push(dataItem);
        return dataItems.join('');
      }

      var samplesCount = Math.floor(_envelopeFullLength);
      var wav = new Array(samplesCount);
      synthWave(wav, wav.length);

      var channels = 1;
      var bytesPerSample = this.bitDepth >> 3;
      var bytesPerSecond = this.sampleRate * bytesPerSample;
      var data = packInt16Array(wav);

      var waveFileChunks = [];
      /*
        The 12 byte RIFF chunk is constructed like this:
          Bytes 0 - 3 :'R' 'I' 'F' 'F'
          Bytes 4 - 7 :Length of file, minus the first 8 bytes of the RIFF description.
                        (4 bytes for "WAVE" + 24 bytes for format chunk length +
                        8 bytes for data chunk description + actual sample data size.)
          Bytes 8 - 11:'W' 'A' 'V' 'E'
      */
      waveFileChunks.push("RIFF");
      waveFileChunks.push(packUInt32(36 + data.length));
      waveFileChunks.push("WAVE");
      /*
        The 24 byte FORMAT chunk is constructed like this:
          Bytes 0 - 3 :'f' 'm' 't' ' '
          Bytes 4 - 7 :The format chunk length. This is always 16.
          Bytes 8 - 9 :File padding. Always 1.
          Bytes 10- 11:Number of channels. Either 1 for mono,  or 2 for stereo.
          Bytes 12- 15:Sample rate.
          Bytes 16- 19:Number of bytes per second.
          Bytes 20- 21:Bytes per sample. 1 for 8 bit mono, 2 for 8 bit stereo or
                        16 bit mono, 4 for 16 bit stereo.
          Bytes 22- 23:Number of bits per sample.
      */
      waveFileChunks.push("fmt ");
      waveFileChunks.push(packUInt32(16));
      waveFileChunks.push(packUInt16(1));
      waveFileChunks.push(packUInt16(channels));
      waveFileChunks.push(packUInt32(this.sampleRate));
      waveFileChunks.push(packUInt32(bytesPerSecond));
      waveFileChunks.push(packUInt16(bytesPerSample));
      waveFileChunks.push(packUInt16(this.bitDepth));
      /*
        The DATA chunk is constructed like this:
          Bytes 0 - 3 :'d' 'a' 't' 'a'
          Bytes 4 - 7 :Length of data, in bytes.
          Bytes 8 -...:Actual sample data.
      */
      waveFileChunks.push("data");
      waveFileChunks.push(packUInt32(data.length));
      waveFileChunks.push(data);

      var out = waveFileChunks.join('');
      return "data:audio/wav;base64," + btoa(out);
    };

    /**
     * Returns a copy of this SfxrSynth with all settings duplicated
     * @return	A copy of this SfxrSynth
     */
    this.clone = function () {
      var out = new sfxr.Synth();
      out.copyFrom(this, false);

      return out;
    };
    var clone = this.clone;

    /**
     * Copies parameters from another instance
     * @param	synth	Instance to copy parameters from
     */
    this.copyFrom = function (synth, shouldDeleteCache) {
      shouldDeleteCache = shouldDeleteCache === undef ? true : shouldDeleteCache;

      if (shouldDeleteCache) deleteCache();

      this.waveType = synth.waveType;
      this.attackTime = synth.attackTime;
      this.sustainTime = synth.sustainTime;
      this.sustainPunch = synth.sustainPunch;
      this.decayTime = synth.decayTime;
      this.startFrequency = synth.startFrequency;
      this.minFrequency = synth.minFrequency;
      this.slide = synth.slide;
      this.deltaSlide = synth.deltaSlide;
      this.vibratoDepth = synth.vibratoDepth;
      this.vibratoSpeed = synth.vibratoSpeed;
      this.changeAmount = synth.changeAmount;
      this.changeSpeed = synth.changeSpeed;
      this.squareDuty = synth.squareDuty;
      this.dutySweep = synth.dutySweep;
      this.repeatSpeed = synth.repeatSpeed;
      this.phaserOffset = synth.phaserOffset;
      this.phaserSweep = synth.phaserSweep;
      this.lpFilterCutoff = synth.lpFilterCutoff;
      this.lpFilterCutoffSweep = synth.lpFilterCutoffSweep;
      this.lpFilterResonance = synth.lpFilterResonance;
      this.hpFilterCutoff = synth.hpFilterCutoff;
      this.hpFilterCutoffSweep = synth.hpFilterCutoffSweep;
      this.masterVolume = synth.masterVolume;

      validate();
    };
    var copyFrom = this.copyFrom;
  };

  sfxr.createEffect = function(settings) {
   var synth = new sfxr.Synth();
   synth.setSettingsString(settings);
   var buffer = synth.updateBuffer();
   return {
    play: function() {
      synth.play();
    }
   };
  };
})();
