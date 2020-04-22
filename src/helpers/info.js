import Swal from "sweetalert2/dist/sweetalert2.min";

export default function info(options) {
	Swal.fire(options);
}

info.success = (options = {}) => {
	let finalOptions = Object.assign({}, {
		showConfirmButton: false,
		timer: 2000
	}, options, { icon: "success" });
	info(finalOptions);
};

info.error = (options = {}) => {
	let finalOptions = Object.assign({}, {
		showConfirmButton: false,
		timer: 2000,
		title: "Oops...",
		text: "Une erreur est survenue"
	}, options, { icon: "error" });
	info(finalOptions);
};
