import mongoose, { Schema } from "mongoose";

const ticketsCollection = 'tickets'

const ticketSchema = new Schema({
	code: {
		type: String,
		required: true,
		unique: true
	},
	purchase_datetime: {
		type: Date,
		default: Date.now
	},
	amount: {
		type: Number,
		required: true
	},
	purchaser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
		required: true
	},
	products: [{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "products"
		},
		quantity: Number,
		price: Number
	}]
})

const TicketModel = mongoose.model(ticketsCollection, ticketSchema)

export default TicketModel
