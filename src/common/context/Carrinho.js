import { createContext, useContext, useEffect, useState } from 'react';

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = "Carrinho";

export const CarrinhoProvider = ({ children }) => {
    const [carrinho, setCarrinho] = useState([]);
    const [quantidadeProdutos, setQuantidadeProdutos] = useState(0);
    const [valorTotalCarrinho, setValorTotalCarrinho] = useState(0);
    return (
        <CarrinhoContext.Provider
            value={{
                quantidadeProdutos,
                carrinho,
                setCarrinho,
                setQuantidadeProdutos,
                valorTotalCarrinho,
                setValorTotalCarrinho
            }}
        >
            {children}
        </CarrinhoContext.Provider>
    )
}

export const useCarrinhoContext = () => {
    const {
        carrinho,
        setCarrinho,
        quantidadeProdutos,
        setQuantidadeProdutos,
        valorTotalCarrinho,
        setValorTotalCarrinho
    } = useContext(CarrinhoContext);

    function mudarQuantidade(id, quantidade) {
        return carrinho.map(itemDoCarrinho => {
            if (itemDoCarrinho.id === id) itemDoCarrinho.quantidade += quantidade;
            return itemDoCarrinho;
        })
    }

    function adicionarProduto(novoProduto) {
        const temOProduto = carrinho.some(itemDoCarrinho => itemDoCarrinho.id === novoProduto.id);
        if (!temOProduto) {
            novoProduto.quantidade = 1;
            return setCarrinho(carrinhoAnterior =>
                [...carrinhoAnterior, novoProduto]
            )
        }
        setCarrinho(mudarQuantidade(novoProduto.id, 1))
    }

    function removerProduto(id) {
        const produto = carrinho.find((itemDoCarrinho) => itemDoCarrinho.id === id);
        const eOUltimo = produto.quantidade === 1;
        if (eOUltimo) {
            return setCarrinho(carrinhoAnterior => carrinhoAnterior.filter(itemDoCarrinho =>
                itemDoCarrinho.id !== id))
        }
        setCarrinho(mudarQuantidade(id, -1))
    }

    useEffect(() => {
        const { novoTotal, novaQuantidade } = carrinho.reduce((contador, produto) =>
        ({
            novaQuantidade: contador + produto.quantidade,
            novoTotal: contador.novoTotal + (produto.valor * produto.quantidade)
        }), {
            novaQuantidade: 0,
            notoTotal: 0
        });
        setQuantidadeProdutos(novaQuantidade);
        setValorTotalCarrinho(novoTotal);

    }, [carrinho, setQuantidadeProdutos]);

    return {
        carrinho,
        setCarrinho,
        adicionarProduto,
        removerProduto,
        quantidadeProdutos,
        setQuantidadeProdutos,
        valorTotalCarrinho
    }
}