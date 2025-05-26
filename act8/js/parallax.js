function castParallax() {
	const layers = document.getElementsByClassName("parallax");

	function updateLayers() {
		const top = window.pageYOffset;
		for (let i = 0; i < layers.length; i++) {
			let layer = layers[i];
			let speed = layer.getAttribute('data-speed');
			let yPos = -(top * speed / 100);
			layer.style.transform = `translate3d(0px, ${yPos}px, 0px)`;
		}
		requestAnimationFrame(updateLayers);
	}

	requestAnimationFrame(updateLayers);
}

function dispelParallax() {
	$("#nonparallax").css('display', 'block');
	$("#parallax").css('display', 'none');
}

function castSmoothScroll() {
	$.srSmoothscroll({
		step: 80,
		speed: 300,
		ease: 'linear'
	});
}

function startSite() {
	const platform = navigator.platform.toLowerCase();

	if (platform.includes('ipad') || platform.includes('iphone')) {
		dispelParallax();
	} else {
		castParallax();
		if ($.browser?.webkit) {
			castSmoothScroll();
		}
	}
}

document.body.onload = startSite;
