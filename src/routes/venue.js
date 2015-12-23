import Venue from '../models/venue';

export function venuePost(req, res) {
  const newVenue = new Venue();

  newVenue.name = req.body.name;
  newVenue.city = req.body.address;
  newVenue.capacity = req.body.capacity;
  newVenue.address = req.body.address;
  newVenue.owner = req.user.id;

  newVenue.save((err, venue) => {
    if (err) { return res.status(400).json({ err }); }

    return res.status(201).json({ venue });
  });
}

export function venueGet(req, res) {
  Venue.findOne({ _id: req.params.id }, (err, venue) => {
    if (err) { throw err; }
    return res.status(200).json({ venue });
  });
}

export function venueUpdate(req, res) {
  Venue.findOne({ _id: req.params.id }, (err, venue) => {
    if (req.user.id !== venue.owner.toString()) {
      return res.status(401).json({ error: [{ msg: 'Unauthorized' }] });
    }

    Venue.findByIdAndUpdate(
      venue.id,
      { name: req.body.name },
      { new: true },
      (error, newVenue) => {
        if (error) { throw error; }
        return res.status(200).json({ venue: newVenue });
      }
    );
  });
}
