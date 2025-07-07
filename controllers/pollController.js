import Poll from '../models/Poll.js';

// create a new poll 
export const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const poll = new Poll({
      question,
      options: options.map(opt => ({ text: opt })),
      createdBy: req.user.id
    }); 
    await poll.save(); 
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create poll', error: err });
  }
};

// update existing poll 
export const updatePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options } = req.body; // Accept both question and options for update 
    const updatedPoll = await Poll.findByIdAndUpdate(
      id,
      { question, options: options.map(opt => ({ text: opt })) }, // Update both question and options
      { new: true }
    );
    res.status(200).json(updatedPoll); 
  } catch (err) {
    res.status(500).json({ message: 'Failed to update poll', error: err });
  }
};

// delete a poll 
export const deletePoll = async (req, res) => {
  try {
    const { id } = req.params;
    await Poll.findByIdAndDelete(id); 
    res.status(200).json({ message: 'Poll deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete poll', error: err }); 
  }
};

// fetch all polls
export const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find();
    res.status(200).json(polls); 
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch polls', error: err });
  }
};

// vote on a poll 
export const votePoll = async (req, res) => {
  try {
    const { pollId, optionIndex } = req.body;
    const userId = req.user.id; // Get user ID from middleware 

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: 'Poll not found' }); 

    // Check if user has already voted
    if (poll.votedBy.includes(userId)) {
      return res.status(400).json({ message: 'You have already voted on this poll' }); 
    }

    poll.options[optionIndex].votes += 1;
    poll.votedBy.push(userId); // Record the user's vote
    await poll.save();
    res.status(200).json({ message: 'Vote recorded successfully', poll }); 
  } catch (err) {
    res.status(500).json({ message: 'Failed to record vote', error: err.message }); 
  }
};