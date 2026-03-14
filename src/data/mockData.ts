export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
  readTime: string;
  featured?: boolean;
}

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Przyszłość AI: Czy rok 2026 będzie przełomem w świadomości maszyn?',
    excerpt: 'Analizujemy najnowsze trendy w modelach językowych i ich wpływ na codzienne życie. Czy granica między człowiekiem a AI zaczyna się zacierać?',
    category: 'Sztuczna Inteligencja',
    author: 'Marek Kowalski',
    date: '2026-03-13',
    imageUrl: 'https://picsum.photos/seed/ai-future/1200/800',
    readTime: '8 min',
    featured: true
  },
  {
    id: '2',
    title: 'Design Top Awards 2026: Zwycięzcy ogłoszeni',
    excerpt: 'Oto projekty, które zdefiniowały estetykę nadchodzącej dekady. Minimalizm spotyka się z brutalizmem cyfrowym.',
    category: 'Design',
    author: 'Anna Nowak',
    date: '2026-03-12',
    imageUrl: 'https://picsum.photos/seed/design-awards/800/600',
    readTime: '5 min'
  },
  {
    id: '3',
    title: 'Kwantowe komputery w Twoim domu? Nowa era gamingu',
    excerpt: 'Pierwsze prototypy procesorów kwantowych dla konsumentów trafiają do testów. Co to oznacza dla wydajności?',
    category: 'Hardware',
    author: 'Piotr Zieliński',
    date: '2026-03-11',
    imageUrl: 'https://picsum.photos/seed/quantum/800/600',
    readTime: '12 min'
  },
  {
    id: '4',
    title: 'Neuralink 4.0: Bezpośrednie połączenie z chmurą',
    excerpt: 'Nowa generacja implantów pozwala na przesyłanie myśli bezpośrednio do sieci. Etyka kontra postęp.',
    category: 'BioTech',
    author: 'Ewa Wiśniewska',
    date: '2026-03-10',
    imageUrl: 'https://picsum.photos/seed/neural/800/600',
    readTime: '10 min'
  },
  {
    id: '5',
    title: 'Marsjańska Kolonia: Pierwsze zdjęcia z bazy Alpha',
    excerpt: 'SpaceX udostępnia panoramiczne ujęcia z pierwszej stałej osady na Czerwonej Planecie.',
    category: 'Kosmos',
    author: 'Janusz Kosmos',
    date: '2026-03-09',
    imageUrl: 'https://picsum.photos/seed/mars/800/600',
    readTime: '15 min'
  }
];
