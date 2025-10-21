'use client';

import { Button } from '@/components/ui/button';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import Link from 'next/link';

const testimonials = [
  {
    name: "Jane Doe",
    role: "Frontend Developer",
    text: "This LMS helped me land my first tech job. The content is top-notch and easy to follow!",
  },
  {
    name: "Alex Johnson",
    role: "Student",
    text: "I never thought online learning could be this effective. The quizzes and videos are so engaging.",
  },
  {
    name: "Maria Gonzalez",
    role: "Bootcamp Graduate",
    text: "The mentorship and structure of this platform made all the difference in my learning journey.",
  },
  {
    name: "David Kim",
    role: "Backend Engineer",
    text: "The practical projects included really helped me build my portfolio. Highly recommend!",
  },
  {
    name: "Sara Lee",
    role: "Career Switcher",
    text: "After using this LMS, I successfully transitioned into tech. The support is incredible!",
  },
];

const Testimony = () => {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 15,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: {
          perView: 2,
          spacing: 15,
        },
      },
    },
    created: (slider) => {
      slider.moveToIdx(0, true);
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 3500);
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <div>
      <div className="not-dark:bg-white py-10 md:py-20 px-3 container mx-auto">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center">What Our Students Say</h2>
          <div ref={sliderRef} className="keen-slider">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="keen-slider__slide bg-muted rounded-md p-4 md:p-6 shadow-md">
                <p className="text-sm md:text-lg italic not-dark:text-gray-800 dark:text-gray-200">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="mt-4">
                  <p className="font-semibold text-sm md:text-base">{testimonial.name}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full flex justify-center md:justify-end mt-5 px-3">
          <Link href="/register">
            <Button className="w-full sm:w-auto flex items-center justify-center gap-2">
              <p>Enroll Now</p>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Testimony;
