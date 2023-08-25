export type TLink = {
  domain: string;
  related: string[];
};

export type TLinksStore = {
  initialLinks: TLink[];
  downloadedLinks: TLink[];
  downloadedAt: Date;
};

export const linksStore: TLinksStore = {
  initialLinks: [
    {
      domain: 'FitnessFreaksPro.com',
      related: ['http://sustainablestyleshop.com/'],
    },
  ],
  downloadedLinks: [],
  downloadedAt: new Date(),
};
