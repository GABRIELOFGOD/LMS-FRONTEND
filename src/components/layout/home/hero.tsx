import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import HeroImage from "@/assets/hero-fc.png";

const Hero = () => {
  
  return (
    <div className='w-full h-fit md:py-32 py-24 bg-primary/80'>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 px-3">
        <div className='flex flex-col gap-3'>
          <div>
            <p className='text-lg font-semibold rounded-full py-1 px-6 bg-border/50 w-fit'>Fact-check <span className='text-secondary'>Africa</span></p>
            <p className='leading-15 text-3xl md:text-5xl font-extrabold text-white'>Learn to fact-check information and Aid is the stop of <span className='text-secondary'>Rumor spread</span></p>
          </div>
          <p className='text-lg text-white'>Information spread like wild fire, without proper check we can be part of the spread of mis-information, take our free course and learn how to fact-check information before spreading or joining in the spread.</p>
          <div className="flex gap-5 mt-5">
            <Button>Get Started</Button>
            <Button
              variant={"outline"}
            >
              <p>Learn more</p>
              <ArrowRight />
            </Button>
          </div>
        </div>
        <div className='w-full relative'>
          <Image
            src={HeroImage}
            alt='Hero image'
            fill
            className='h-full object-cover'
          />
        </div>
      </div>
    </div>
  )
}

export default Hero;