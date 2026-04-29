const AddArtworkForm = () => {
  return (
    <form action="" className="modal-form">
      <label htmlFor="">Title</label>
      <input type="text" placeholder="e.g. Mona Lisa" />

      <label htmlFor="">Year Created</label>
      <input type="number" />

      <label htmlFor="">Medium</label>
      <input type="text" placeholder="e.g. Oil on canvas" />

      <label htmlFor="">Image URL</label>
      <input type="text" placeholder="e.g. wikimedia.com/mona-lisa.jpg" />

      <div className="modal-btn-container">
        <button className="gold-outline-btn">Cancel</button>
        <button className="gold-btn">Add Artwork</button>
      </div>
    </form>
  )
}

export default AddArtworkForm