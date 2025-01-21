// This template requires the Embla Auto Scroll plugin to be installed:
//
// npm install embla-carousel-auto-scroll

"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const logos = [
  {
    id: "logo-1",
    description: "KPM",
    image:
      "https://upload.wikimedia.org/wikipedia/ms/thumb/8/8b/KPM_Logo.png/1024px-KPM_Logo.png",
  },
  {
    id: "logo-2",
    description: "KPWKM",
    image: "https://img.astroawani.com/2021-03/81615384622_LogoKPWKM.jpg",
  },
  {
    id: "logo-3",
    description: "KPT",
    image:
      "https://thesun.my/binrepository/kpt-logo_1083770_20200412130758.jpg",
  },
  {
    id: "logo-4",
    description: "MOSTI",
    image:
      "https://i0.wp.com/sebenarnya.my/wp-content/uploads/2017/09/mosti-logo-vector-720x340.png?fit=720%2C340&ssl=1",
  },
  {
    id: "logo-5",
    description: "UPM",
    image: "https://upm.edu.my/assets/images23/20170406143426UPM-New_FINAL.jpg",
  },
  {
    id: "logo-6",
    description: "Smart Reader",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS14sln0vhAQ4pEwOaLjEz-3wZfuXjuRuDu2A&s",
  },
  {
    id: "logo-7",
    description: "kemas",
    image:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi6suEKcBEUlLQ2cev2OHuMrgUeIcQzi4VwsX6LtookJ7V_SvFN5cV7onqo0mLYetRXrOjigcWLmaKbDQTfM4G8TIXvpoJB51y9moX_KY293JWlhNfNjqkobbvf_nZUOB-XpzdY2bmE-2Q/s280/KEMAS.png",
  },
  {
    id: "logo-8",
    description: "Persatuan Tadika Malaysia",
    image:
      "https://scontent.fkul3-3.fna.fbcdn.net/v/t39.30808-6/305317836_578284914086670_6322325625651707310_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=6xOIZAsVJkoQ7kNvgFPa-DJ&_nc_zt=23&_nc_ht=scontent.fkul3-3.fna&_nc_gid=AyffNR30DOBZbwkPL7GoGLo&oh=00_AYAEL4vymEWa4HMGD8_jMdNGDeHiMSfn7mbelpidY5Y5_A&oe=6794E901",
  },
];

const CompaniesLogo = () => {
  return (
    <section>
      <div className="relative flex h-[600px] w-full flex-col items-center justify-center overflow-hidden rounded-lg  bg-white bg-background md:shadow-xl">
        <div className="container mx-auto flex flex-col items-center text-center">
          <h1 className="my-6 text-pretty text-2xl font-bold lg:text-4xl">
            Future Partnerships & Collaboration
          </h1>
        </div>
        <div className="pt-10 md:pt-16 lg:pt-20">
          <div className="relative mx-auto flex items-center justify-center lg:max-w-5xl">
            <Carousel
              opts={{ loop: true }}
              plugins={[AutoScroll({ playOnInit: true })]}
            >
              <CarouselContent className="ml-0">
                {logos.map((logo) => (
                  <CarouselItem
                    key={logo.id}
                    className="basis-1/3 pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                  >
                    <div className="mx-10 flex shrink-0 items-center justify-center">
                      <div>
                        <img
                          src={logo.image}
                          alt={logo.description}
                          className="h-11 w-auto"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
          )}
        />
      </div>
    </section>
  );
};

export default CompaniesLogo;
