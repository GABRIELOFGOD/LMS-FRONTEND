import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import HeroImage from "@/assets/hero-fc.png";

const Hero = () => {
  
  return (
    <div className='w-full h-fit md:py-32 py-16 bg-primary/80'>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 px-3">
        <div className='flex flex-col gap-3 text-center md:text-left order-2 md:order-1'>
          <div>
            <p className='text-sm md:text-lg font-semibold rounded-full py-1 px-4 md:px-6 bg-border/50 w-fit mx-auto md:mx-0'>
              Fact-check <span className='text-secondary'>Africa</span>
            </p>
            <p className='leading-tight text-2xl md:text-3xl lg:text-5xl font-extrabold text-white mt-4'>
              Learn to fact-check information and Aid in the stop of <span className='text-secondary'>Rumor spread</span>
            </p>
          </div>
          <p className='text-sm md:text-lg text-white'>
            Information spread like wild fire, without proper check we can be part of the spread of mis-information, take our free course and learn how to fact-check information before spreading or joining in the spread.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-5 mt-5">
            <Button className="w-full sm:w-auto" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
            <Button
              variant={"outline"}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
              asChild
            >
              <Link href="/about">
                <p>Learn more</p>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className='w-full relative h-48 md:h-80 lg:h-96 order-1 md:order-2'>
          <Image
            src={HeroImage}
            alt='Hero image'
            fill
            className='h-full object-cover rounded-lg md:rounded-none'
          />
        </div>
      </div>
    </div>
  )
}

export default Hero;