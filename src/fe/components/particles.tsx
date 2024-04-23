"use client";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { loadFull } from "tsparticles";
import { Container, MoveDirection, OutMode } from "tsparticles-engine";

type ParticlesComponentProps = {
  id: string;
};

type OptionsType = {
  background: {
    color: {
      value: string;
    };
  };
  fpsLimit: number;
  interactivity: {
    events: {
      onClick: {
        enable: boolean;
        mode: string;
      };
      onHover: {
        enable: boolean;
        mode: string;
      };
    };
    modes: {
      push: {
        distance: number;
        duration: number;
      };
      grab: {
        distance: number;
      };
    };
  };
  particles: {
    color: {
      value: string;
    };
    links: {
      color: string;
      distance: number;
      enable: boolean;
      opacity: number;
      width: number;
    };
    move: {
      direction: MoveDirection;
      enable: boolean;
      outModes: OutMode;
      random: boolean;
      speed: number;
      straight: boolean;
    };
    number: {
      density: {
        enable: boolean;
      };
      value: number;
    };
    opacity: {
      value: number;
    };
    shape: {
      type: string;
    };
    size: {
      value: {
        min: number;
        max: number;
      };
    };
  };
  detectRetina: boolean;
};

const ParticlesComponent = (props: ParticlesComponentProps) => {
  const { theme } = useTheme();

  const [options, setOptions] = useState<OptionsType | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load particles engine
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setIsInitialized(true);
    });
  }, []);

  useEffect(() => {
    if (isInitialized) {
      const newOptions: OptionsType = {
        background: {
          color: {
            value: theme === 'dark' ? "#000000" : "#FFFFFF",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "repulse",
            },
            onHover: {
              enable: true,
              mode: "grab",
            },
          },
          modes: {
            push: {
              distance: 200,
              duration: 15,
            },
            grab: {
              distance: 150,
            },
          },
        },
        particles: {
          color: {
            value: theme === 'dark' ? "#FFFFFF" : "#000000",
          },
          links: {
            color: theme === 'dark' ? "#FFFFFF" : "#000000",
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1,
          },
          move: {
            direction: "none" as MoveDirection,
            enable: true,
            outModes: "bounce" as OutMode,
            random: true,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
            },
            value: 150,
          },
          opacity: {
            value: 1.0,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      };
      setOptions(newOptions);
    }
  }, [theme, isInitialized]);

  return isInitialized && options ? <Particles id={props.id} options={options} /> : null;
};

export default ParticlesComponent;