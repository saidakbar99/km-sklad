import {useState, useEffect} from "react";
import axios from "axios";
import MainLayout from "../components/MainLayout";
import {Dropdown} from "primereact/dropdown";
import {InputNumber} from "primereact/inputnumber";
import {TabView, TabPanel} from "primereact/tabview";
import {RadioButton} from "primereact/radiobutton";
import {AutoComplete} from "primereact/autocomplete";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const SerialGenerationPage = () => {
	const navigate = useNavigate();
	const [activeIndex, setActiveIndex] = useState(0);
	const [demands, setDemands] = useState([]);
	const [selectedDemand, setSelectedDemand] = useState();
	const [clientFurniture, setClientFurniture] = useState([]);
	const [selectedFurniture, setSelectedFurniture] = useState();
	const [furnitureAmount, setFurnitureAmount] = useState(0);
	const [packageQuantity, setPackageQuantity] = useState(0);
	const [position, setPosition] = useState(null);

	const [allCategories, setAllCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState();
	const [sets, setSets] = useState([]);
	const [selectedSet, setSelectedSet] = useState();
	const [storeFurniture, setStoreFurniture] = useState([]);
	const [selectedStoreFurniture, setSelectedStoreFurniture] = useState();
	const [colors, setColors] = useState([]);
	const [selectedColor, setSelectedColor] = useState();
	const [trees, setTrees] = useState([]);
	const [selectedTree, setSelectedTree] = useState();
	const [storeAmount, setStoreAmount] = useState(0);
	const [searchSetsFilter, setSearchSetsFilter] = useState([]);
	const [searchStoreFurniture, setSearchStoreFurniture] = useState([]);

	console.log(">>>selectedStoreFurniture", selectedStoreFurniture);

	const searchDemands = async (event) => {
		console.log(">>>e", event.query);
		if (event.query.length >= 3) {
			const response = await axios.post("http://localhost:5000/api/demand", {
				demandNumber: event.query,
			});
			setDemands(response.data.demands);
		}
	};

	const handleClientFurnitureSelect = async () => {
		const response = await axios.post(
			"http://localhost:5000/api/demand-furniture",
			{demandId: demands[0].id}
		);
		const {furnitures} = response.data;

		const furnitureResponses = await Promise.all(
			furnitures.map((item) =>
				axios.post("http://localhost:5000/api/furniture", {
					furnitureId: item.furniture_id,
				})
			)
		);
		const furnitureData = furnitureResponses.map((res) => res.data.furniture);

		const categoryResponses = await Promise.all(
			furnitureData.map((item) =>
				axios.post("http://localhost:5000/api/category-furniture", {
					categoryId: item.category_id,
				})
			)
		);
		const categoryData = categoryResponses.map((res) => res.data.category);

		const setResponses = await Promise.all(
			furnitures.map((item) =>
				axios.post("http://localhost:5000/api/set-furniture", {
					furnitureId: item.furniture_id,
				})
			)
		);
		const setData = setResponses.map((res) => res.data.set);

		const finalFurniture = furnitureData.map((furniture, index) => ({
			...furniture,
			name: `${categoryData[index].name} ${furniture.name} ${setData[index].name} `,
			amount: furnitures[index].amount,
			unique_id: furnitures[index].unique_id,
			demand_furniture_id: furnitures[index].id,
		}));

		setClientFurniture(finalFurniture);
	};

	const handleStoreSetSelect = async (category) => {
		setSelectedCategory(category);
		const getSets = await axios.post("http://localhost:5000/api/set", {
			categoryId: category.id,
		});
		setSets(getSets.data.sets);
	};

	const handleStoreFurnitureSelect = async (set) => {
		setSelectedSet(set);
		const getFurnitures = await axios.post(
			"http://localhost:5000/api/furnitures",
			{setId: set.id}
		);
		setStoreFurniture(getFurnitures.data.furnitures);
	};

	const generateClientSerial = async () => {
		try {
			await Promise.all([
				axios.put("http://localhost:5000/api/unique", {
					packageQuantity: packageQuantity,
					uniqueId: selectedFurniture.unique_id,
				}),
				axios.post("http://localhost:5000/api/vipusk", {
					furnitureId: selectedFurniture.id,
					uniqueId: selectedFurniture.unique_id,
					amount: selectedFurniture.amount,
					date: new Date().toISOString(),
					demandFurnitureId: selectedFurniture.demand_furniture_id,
				}),
			]);

			navigate("/generated");
		} catch (error) {
			console.log("Error:", error);
			toast.error("Seriya nomer yaratishda xatolik!");
		}
	};

	const generateStoreSerial = async () => {
		try {
			await Promise.all([
				axios.post("http://localhost:5000/api/supermarket-generation", {
					treeId: selectedTree.id,
					colorId: selectedColor.id,
					positionId: position,
					furnitureId: selectedStoreFurniture.id,
					amount: storeAmount,
					date: new Date().toISOString(),
				}),
			]);

			navigate("/generated");
		} catch (error) {
			console.log("Error:", error);
			toast.error("Seriya nomer yaratishda xatolik!");
		}
	};

	useEffect(() => {
		const getAllCategories = async () => {
			if (activeIndex === 1) {
				try {
					const categories = await axios.get(
						"http://localhost:5000/api/categories"
					);
					setAllCategories(categories.data.categories);

					const trees = await axios.get("http://localhost:5000/api/trees");
					setTrees(trees.data.trees);

					const colors = await axios.get("http://localhost:5000/api/colors");
					setColors(colors.data.colors);
				} catch (error) {
					console.log("Error:", error);
				}
			}
		};

		getAllCategories();
	}, [activeIndex]);

	const searchSets = (e) => {
		setSearchSetsFilter(
			sets.filter((value) =>
				value.toLowerCase().includes(e.query.toLowerCase())
			)
		);
	};

	const searchFurniture = (e) => {
		setSearchStoreFurniture(
			storeFurniture.filter((value) =>
				value?.toLowerCase().includes(e.query?.toLowerCase())
			)
		);
	};

	return (
		<MainLayout header="Seriya nomer yaratish">
			<div className="flex justify-center w-full mb-12">
				<TabView
					activeIndex={activeIndex}
					onTabChange={(e) => setActiveIndex(e.index)}
					className="border-none w-full max-w-[760px] mx-auto">
					<TabPanel
						header={
							<span
								className={`pb-2 ${
									activeIndex === 0 ? "border-b-2 border-blue-500" : ""
								}`}>
								Mijozniki
							</span>
						}>
						<div className="w-full">
							<div className="flex flex-col mb-8">
								<label className="text-sm mb-1.5 font-semibold">
									Zakaz nomeri
								</label>
								<AutoComplete
									value={selectedDemand}
									suggestions={demands.map((item) => item.doc_no)}
									completeMethod={searchDemands}
									virtualScrollerOptions={{itemSize: 38}}
									onChange={(e) => setSelectedDemand(e.value)}
									onSelect={handleClientFurnitureSelect}
									className="w-full py-2 pl-4 pr-8 border rounded-lg"
									inputClassName="w-full"
								/>
							</div>

							<div className="flex flex-col mb-8">
								<label className="text-sm mb-1.5 font-semibold">Mebel</label>
								<Dropdown
									value={selectedFurniture}
									onChange={(e) => setSelectedFurniture(e.value)}
									options={clientFurniture}
									disabled={!clientFurniture.length}
									optionLabel="name"
									placeholder="Mebel tanlang"
									className="w-full border rounded-lg"
									loading={!clientFurniture.length && selectedDemand}
								/>
							</div>

							<div className="flex flex-col mb-8">
								<label className="text-sm mb-1.5 font-semibold">Soni</label>
								<div className="flex items-end">
									<InputNumber
										value={
											!!furnitureAmount
												? furnitureAmount
												: selectedFurniture?.amount
										}
										onChange={(e) => setFurnitureAmount(e.value)}
										optionLabel="amount"
										className="px-4 py-3 mr-2 w-fit"
										style={{
											border: "1px solid #ced4da",
											borderRadius: "0.5rem",
										}}
									/>
									<p className="">шт</p>
								</div>
							</div>

							<div className="flex flex-col mb-8">
								<label className="text-sm mb-1.5 font-semibold">
									Bitta mebel nechta qutiga joylandi
								</label>
								<div className="flex items-end">
									<InputNumber
										value={packageQuantity}
										onChange={(e) => setPackageQuantity(e.value)}
										className="px-4 py-3 mr-2 w-fit"
										style={{
											border: "1px solid #ced4da",
											borderRadius: "0.5rem",
										}}
									/>
								</div>
							</div>

							<button
								className="w-full px-4 py-3 text-white rounded-md bg-blue hover:bg-opacity-90"
								onClick={generateClientSerial}
								disabled={!selectedFurniture}>
								Generatsiya qilish
							</button>
						</div>
					</TabPanel>
					<TabPanel
						header={
							<span
								className={`pb-2 ${
									activeIndex === 1 ? "border-b-2 border-blue-500" : ""
								}`}>
								Supermarket
							</span>
						}>
						<div className="w-full">
							<div className="flex flex-col mb-8">
								<label className="text-sm mb-1.5 font-semibold">
									Kategoriya
								</label>
								<Dropdown
									value={selectedCategory}
									onChange={(e) => handleStoreSetSelect(e.value)}
									options={allCategories}
									optionLabel="name"
									placeholder="Kategoriya tanlang"
									className="w-full border rounded-lg"
								/>
							</div>

							<div className="flex flex-col mb-8">
								<label className="text-sm mb-1.5 font-semibold">Komplekt</label>
								<AutoComplete
									value={selectedSet}
									onChange={(e) => handleStoreFurnitureSelect(e.value)}
									placeholder="Komplektni tanlang"
									disabled={!sets.length}
									suggestions={searchSetsFilter}
									completeMethod={searchSets}
									className="w-full border rounded-lg"
									inputClassName="w-full py-2 pl-2 rounded-lg"
								/>
							</div>

							<div className="flex flex-col mb-8">
								<label className="text-sm mb-1.5 font-semibold">Mebel</label>
								<AutoComplete
									value={selectedStoreFurniture}
									onChange={(e) => setSelectedStoreFurniture(e.value)}
									placeholder="Mebelni tanlang"
									disabled={!storeFurniture.length}
									suggestions={searchStoreFurniture}
									completeMethod={searchFurniture}
									className="w-full border rounded-lg"
									inputClassName="w-full py-2 pl-2 rounded-lg"
								/>
							</div>

							<div className="flex flex-col mb-8">
								<label className="text-sm mb-1.5 font-semibold">Soni</label>
								<InputNumber
									value={storeAmount}
									onChange={(e) => setStoreAmount(e.value)}
									className="px-4 py-3 mr-2 w-fit"
									style={{border: "1px solid #ced4da", borderRadius: "0.5rem"}}
								/>
							</div>

							<div className="flex flex-col mb-8">
								<label className="text-sm mb-1.5 font-semibold">Rangi</label>
								<Dropdown
									value={selectedColor}
									onChange={(e) => setSelectedColor(e.value)}
									options={colors}
									placeholder="Rangni tanlang"
									optionLabel="name"
									className="w-full border rounded-lg"
									disabled={!colors.length}
									loading={!colors.length}
								/>
							</div>

							<div className="flex flex-col mb-8">
								<label className="text-sm mb-1.5 font-semibold">Daraxt</label>
								<Dropdown
									value={selectedTree}
									onChange={(e) => setSelectedTree(e.value)}
									options={trees}
									optionLabel="name"
									placeholder="Daraxtni tanlang"
									className="w-full border rounded-lg"
									disabled={!trees.length}
									loading={!trees.length}
								/>
							</div>

							<div className="flex flex-col mb-8">
								<label className="text-sm mb-1.5 font-semibold">Позиция</label>
								<div className="flex flex-col flex-wrap gap-3">
									<div className="flex align-items-center">
										<RadioButton
											className="opacity-100 !w-5 !h-5"
											inputId="ingredient1"
											onChange={() => setPosition(1)}
											checked={position === 1}
										/>
										<label htmlFor="ingredient1" className="ml-2">
											I
										</label>
									</div>
									<div className="flex align-items-center">
										<RadioButton
											inputId="ingredient2"
											onChange={() => setPosition(2)}
											checked={position === 2}
										/>
										<label htmlFor="ingredient2" className="ml-2">
											II
										</label>
									</div>
									<div className="flex align-items-center">
										<RadioButton
											inputId="ingredient3"
											onChange={() => setPosition(3)}
											checked={position === 3}
										/>
										<label htmlFor="ingredient3" className="ml-2">
											III
										</label>
									</div>
								</div>
							</div>

							<button
								className="w-full px-4 py-3 text-white rounded-md bg-blue hover:bg-opacity-90"
								onClick={generateStoreSerial}
								disabled={!selectedStoreFurniture}>
								Generatsiya qilish
							</button>
						</div>
					</TabPanel>
				</TabView>
			</div>
		</MainLayout>
	);
};

export default SerialGenerationPage;
