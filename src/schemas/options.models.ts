type ModeType = {
  name: string;
  direct: string;
};

export const modesList: ModeType[] = [
  { name: 'NoMaze', direct: './nomaze.html' },
  { name: 'Box', direct: './box.html' },
  { name: 'Tunnel', direct: './tunnel.html' },
  { name: 'Mill', direct: './mill.html' },
  { name: 'Rails', direct: './rails.html' },
  { name: 'Campaign', direct: './campaign.html' },
  { name: 'Apartment', direct: './apartment.html' }
];
