'use client';
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import messages from "@/messages/messages.json"
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <main className="mt-8 place-items-center">
      <section className="text-center mb-8 md:mb-12 p-10 space-y-5">
        <h1 className="text-3xl md:text-4xl font-semibold">Dive into the World of Anonymous Feedback</h1>
        <section className=" text-left md:max-w-2xl w-[90%] mx-auto">
          <Carousel
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="">
                  <Card className="p-5">
                    <CardHeader>
                      <CardTitle>{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0" />
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
        <p className="mt-3 md:mt-4 text-base md:text-lg"> True Feedback - Where your identity remains a secret.</p>
        <div>
          <Button className="rounded-full mr-5 px-10">
            <Link href={'/signup'}>Get started</Link>
          </Button>
          <Button className="rounded-full px-10 hover:bg-gray-900 hover:text-white transition-all duration-300 ease-in-out" variant={'outline'}>
            <Link href={'/signin'}>Login</Link>
          </Button>
        </div>
      </section>

    </main >
  );
}
